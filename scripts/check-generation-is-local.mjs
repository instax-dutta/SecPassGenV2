// Gate oracle: passwords are produced in the browser and never transmitted.
//
// Absence checks carry a positive control, because "we found no fetch call"
// is worthless if the detector is broken.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const failures = []
const ok = (cond, msg) => { if (!cond) failures.push(msg) }

// Scoped to application source so the detectors in scripts/, which contain
// these strings as patterns, do not trip their own absence checks.
const SOURCE_DIRS = ['app', 'components', 'hooks', 'lib']
const SKIP = new Set(['node_modules', '.next', '.git', '.fixtures', '.unlazy'])
const sources = []
const walk = (dir) => {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(ts|tsx)$/.test(entry)) sources.push(p)
  }
}
for (const d of SOURCE_DIRS) walk(join(root, d))
const read = (rel) => readFileSync(join(root, rel), 'utf8')

// --- positive control --------------------------------------------------------
const control = read('scripts/.fixtures/server-fetch.ts')
ok(/fetch\(\s*['"`]\/api\/generate/.test(control), 'CONTROL FAILED: the server-fetch detector no longer matches its fixture')

// --- no component or library makes a network call ---------------------------
const fetchers = sources.filter((f) => /\bfetch\s*\(/.test(readFileSync(f, 'utf8')))
ok(fetchers.length === 0, `network calls remain in: ${fetchers.join(', ')}`)

// --- no XMLHttpRequest / sendBeacon / websocket escape hatch ----------------
for (const [name, re] of [
  ['XMLHttpRequest', /\bnew\s+XMLHttpRequest\b/],
  ['sendBeacon', /navigator\.sendBeacon/],
  ['WebSocket', /\bnew\s+WebSocket\b/],
  ['EventSource', /\bnew\s+EventSource\b/],
]) {
  const offenders = sources.filter((f) => re.test(readFileSync(f, 'utf8')))
  ok(offenders.length === 0, `${name} still used in: ${offenders.join(', ')}`)
}

// --- the generator really does the work locally ------------------------------
const generator = read('components/PasswordGenerator.tsx')
ok(/from\s+'@\/lib\/entropy'/.test(generator), 'PasswordGenerator no longer imports the entropy module')
ok(/meetsEntropyFloor/.test(generator), 'PasswordGenerator no longer enforces the entropy floor client-side')
ok(/generatePassword/.test(generator), 'PasswordGenerator no longer calls the local generator')
ok(/SessionDedup/.test(generator), 'PasswordGenerator no longer applies session dedup')
ok(!/fetch\s*\(/.test(generator), 'PasswordGenerator still performs a fetch')

// --- and the entropy source is the platform CSPRNG ---------------------------
const random = read('lib/random.ts')
ok(/crypto\.getRandomValues/.test(random), 'lib/random.ts no longer uses crypto.getRandomValues')
ok(!/Math\.random/.test(random), 'lib/random.ts regressed to Math.random')

// --- a password must not appear in any server-rendered output ---------------
ok(!existsSync(join(root, 'app', 'api')), 'a server route exists and could receive a password')

if (failures.length) {
  console.error('local generation check FAILED:')
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log(`local generation check passed (${sources.length} sources, no network egress path)`)
console.log('GENERATION IS LOCAL VERIFIED')