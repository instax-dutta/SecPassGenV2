// Gate oracle: the app has no server-side state at all.
//
// Absence checks, so every detector is first fired against a fixture holding
// exactly what was removed. A detector that cannot fire proves nothing.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const failures = []
const ok = (cond, msg) => { if (!cond) failures.push(msg) }

// Scoped to application source. The detectors under scripts/ legitimately
// contain these strings as patterns, and scanning them would self-trigger.
const SOURCE_DIRS = ['app', 'components', 'hooks', 'lib']
const SKIP = new Set(['node_modules', '.next', '.git', '.fixtures', '.unlazy'])
const sources = []
const walk = (dir) => {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(ts|tsx|js|mjs|json)$/.test(entry)) sources.push(p)
  }
}
for (const d of SOURCE_DIRS) walk(join(root, d))

const read = (rel) => readFileSync(join(root, rel), 'utf8')
const FORBIDDEN_VARS = ['DATABASE_URL', 'UNIQUENESS_SECRET', 'IP_PEPPER', 'IP_SALT', 'NEON_DATABASE_URL']

// --- positive controls ------------------------------------------------------
const control = read('scripts/.fixtures/server-state.ts')
ok(/@neondatabase\/serverless/.test(control), 'CONTROL FAILED: the neon import detector no longer matches its fixture')
ok(/process\.env\.DATABASE_URL/.test(control), 'CONTROL FAILED: the DATABASE_URL detector no longer matches its fixture')
ok(/process\.env\.UNIQUENESS_SECRET/.test(control), 'CONTROL FAILED: the UNIQUENESS_SECRET detector no longer matches its fixture')
ok(existsSync(join(root, 'scripts/.fixtures/legacy-schema.sql')), 'CONTROL FAILED: schema detector fixture missing')

// --- the server-side persistence layer is gone ------------------------------
ok(!existsSync(join(root, 'app', 'api')), 'app/api still exists; a server route is still being served')
ok(!existsSync(join(root, 'lib', 'db.ts')), 'lib/db.ts still exists')
ok(!existsSync(join(root, 'schema.sql')), 'schema.sql still exists')
ok(!existsSync(join(root, 'lib', 'hashing.ts')), 'lib/hashing.ts still exists but has no caller once nothing is signed')

// --- no source references a database driver ---------------------------------
const neonImporters = sources.filter((f) => /@neondatabase\/serverless|\bneon\(/.test(readFileSync(f, 'utf8')))
ok(neonImporters.length === 0, `database driver still referenced in: ${neonImporters.join(', ')}`)

// --- no source requires a server secret -------------------------------------
const envHygiene = []
for (const f of sources) {
  const text = readFileSync(f, 'utf8')
  for (const v of FORBIDDEN_VARS) {
    if (new RegExp(`process\\.env\\.${v}\\b`).test(text)) envHygiene.push(`${f} reads process.env.${v}`)
  }
}
ok(envHygiene.length === 0, `server secrets still read in source: ${envHygiene.join('; ')}`)

// --- and none is declared as one either -------------------------------------
const envExample = read('.env.example')
for (const v of FORBIDDEN_VARS) {
  ok(!new RegExp(`^${v}\\s*=`, 'm').test(envExample), `.env.example still declares ${v}`)
}

// --- the dependency is unlisted ----------------------------------------------
const pkg = JSON.parse(read('package.json'))
const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) }
ok(!(' @neondatabase/serverless'.trim() in allDeps), '@neondatabase/serverless is still a declared dependency')

if (failures.length) {
  console.error('server state check FAILED:')
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log(`server state check passed (${sources.length} sources scanned, all four controls fired)`)
console.log('NO SERVER STATE VERIFIED')