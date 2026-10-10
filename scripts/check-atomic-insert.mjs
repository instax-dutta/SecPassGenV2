// Gate oracle: recording is one atomic statement, not check-then-act.
//
// This is a source-shape check, so the detector is exercised against a fixture
// holding the exact code being removed. A detector that cannot fire is worthless.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const dbPath = join(process.cwd(), 'lib', 'db.ts')
const src = readFileSync(dbPath, 'utf8')
const fixturePath = join(process.cwd(), 'scripts', '.fixtures', 'check-then-act.ts')

const failures = []
const ok = (cond, msg) => { if (!cond) failures.push(msg) }

// --- positive control: the detectors must fire on the shape being removed ---
const control = readFileSync(fixturePath, 'utf8')
ok(/SELECT\s+COUNT\(\*\)/i.test(control), 'POSITIVE CONTROL FAILED: the COUNT(*) detector no longer matches its fixture')
ok(/export\s+async\s+function\s+isPasswordUnique/.test(control), 'POSITIVE CONTROL FAILED: the isPasswordUnique detector no longer matches its fixture')
ok(/ON CONFLICT/i.test(control), 'POSITIVE CONTROL FAILED: the ON CONFLICT detector is broken')
ok(/RETURNING/i.test(control), 'POSITIVE CONTROL FAILED: the RETURNING detector is broken')

// --- the real assertions against lib/db.ts ---------------------------------
ok(!/export\s+async\s+function\s+isPasswordUnique/.test(src), 'isPasswordUnique still exists; the check-then-act probe was not removed')
ok(!/SELECT\s+COUNT\(\*\)/i.test(src), 'a COUNT(*) uniqueness probe is still being issued')
ok(!/export\s+async\s+function\s+savePassword\b/.test(src), 'the separate non-atomic savePassword writer still exists')

ok(/ON\s+CONFLICT/i.test(src), 'no ON CONFLICT clause found; the insert is not idempotent')
ok(/RETURNING/i.test(src), 'no RETURNING clause found; the insert cannot report whether the row was new')
ok(/DO\s+NOTHING/i.test(src), 'ON CONFLICT must be paired with DO NOTHING')

// the collision signal must be derived from the statement, not a prior read
ok(/rows\.length\s*===\s*0|!rows\.length|rows\.length\s*!==\s*0|rows\.length\s*>\s*0/.test(src),
  'the caller must decide collision from the number of returned rows')

// the raw password must never reach the SQL layer
ok(!/VALUES\s*\([^)]*\$\{?password\}?\s*,/i.test(src), 'a bare `password` binding appears in an INSERT statement')
ok(/keyedHash|hashPassword/.test(src), 'db.ts no longer derives its signature through the keyed hash helper')

if (failures.length) {
  console.error('atomic insert check FAILED:')
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log('atomic insert check passed (single ON CONFLICT ... RETURNING statement, control fired)')
console.log('ATOMIC INSERT VERIFIED')
