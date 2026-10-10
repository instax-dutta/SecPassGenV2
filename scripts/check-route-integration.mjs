// Gate oracle: the deployed route enforces the floor end to end.
//
// The floor check must reject before any database access, so this runs against
// an unreachable database on purpose: if the weak request still returns 400 with
// the floor error, the rejection provably happened without touching Postgres.
import { spawn } from 'node:child_process'
import { join } from 'node:path'

const PORT = 3187
const ROOT = process.cwd()
const failures = []
const ok = (cond, msg) => { if (!cond) failures.push(msg) }

const server = spawn('npx', ['next', 'dev', '--port', String(PORT)], {
  cwd: ROOT,
  detached: true,
  env: {
    ...process.env,
    DATABASE_URL: 'postgresql://nobody:nobody@127.0.0.1:1/none',
    UNIQUENESS_SECRET: 'integration-gate-secret-value-32-chars',
    NEXT_PUBLIC_APP_URL: `http://127.0.0.1:${PORT}`,
  },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let serverLog = ''
server.stdout.on('data', (d) => { serverLog += d.toString() })
server.stderr.on('data', (d) => { serverLog += d.toString() })

const stop = () => {
  try { process.kill(-server.pid, 'SIGKILL') } catch {}
  try { server.kill('SIGKILL') } catch {}
}
process.on('exit', stop)
process.on('SIGINT', () => { stop(); process.exit(1) })

const post = async (body, attempts = 2) => {
  let lastError = null
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(240000),
      })
      let json = null
      try { json = await res.json() } catch {}
      return { status: res.status, json }
    } catch (e) {
      lastError = e
      // first hit on a route triggers an on-demand compile in next dev
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
  throw new Error(`request failed after ${attempts} attempts: ${lastError && lastError.message}`)
}

// wait for the dev server, then warm the route we actually exercise so the
// on-demand compile happens here rather than inside a timed assertion
let ready = false
const deadline = Date.now() + 180000
while (Date.now() < deadline && !ready) {
  if (server.exitCode !== null) break
  try {
    const probe = await fetch(`http://127.0.0.1:${PORT}/api/stats`, { signal: AbortSignal.timeout(10000) })
    if (probe.status > 0) ready = true
  } catch {}
  if (!ready) await new Promise((r) => setTimeout(r, 750))
}
ok(ready, `dev server never became ready.\n--- server log ---\n${serverLog.slice(-3000)}`)

if (ready) {
  // 8 lowercase characters is the weak corner: ~37.6 bits, far under the floor
  const weak = await post({
    length: 8,
    count: 1,
    includeUppercase: false,
    includeLowercase: true,
    includeNumbers: false,
    includeSymbols: false,
  })
  ok(weak.status === 400, `an under-floor request must be rejected with 400, got ${weak.status}`)
  ok(!!weak.json && !!weak.json.error, `an under-floor request must carry an error payload, got: ${JSON.stringify(weak.json)}`)
  ok(/entropy/i.test((weak.json && weak.json.error) || ''), `the rejection must explain itself in terms of entropy, got: ${JSON.stringify(weak.json)}`)

  // the same weak alphabet at a compliant length must get past the floor check
  const fixed = await post({
    length: 16,
    count: 1,
    includeUppercase: false,
    includeLowercase: true,
    includeNumbers: false,
    includeSymbols: false,
  })
  ok(fixed.status !== 400, `a compliant request must not return 400, got ${fixed.status}`)
  ok(fixed.json && !fixed.json.error, `a compliant request must not carry an error payload, got: ${JSON.stringify(fixed.json)}`)
  ok(
    Array.isArray(fixed.json?.passwords) && fixed.json.passwords.length === 1,
    `a compliant request must still be served a password, got: ${JSON.stringify(fixed.json)}`
  )
  // and it must actually be at or above the floor it claims to enforce
  ok(
    typeof fixed.json?.entropyBits === 'number' && fixed.json.entropyBits >= 60,
    `a served password must report at least 60 bits, got ${fixed.json?.entropyBits}`
  )

  // positive control: the two requests must genuinely diverge, otherwise the
  // assertions above compare nothing
  ok(
    weak.status === 400 && !!weak.json?.error && fixed.status !== 400 && !fixed.json?.error,
    'CONTROL INVALID: the weak and compliant requests did not diverge, so neither assertion is meaningful'
  )
}

stop()

if (failures.length) {
  console.error('route integration check FAILED:')
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log('route integration check passed (floor enforced in the running route before any DB access)')
console.log('ROUTE INTEGRATION VERIFIED')
