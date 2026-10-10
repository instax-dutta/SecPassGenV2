// Gate oracle: per-session duplicate suppression with a hard memory ceiling.
import { SessionDedup } from '../lib/sessionDedup.ts'

const failures = []
const ok = (cond, msg) => { if (!cond) failures.push(msg) }

// --- a password already on screen is refused --------------------------------
const d = new SessionDedup(4)
ok((await d.admit('alpha')) === true, 'the first sighting of a password must be admitted')
ok((await d.admit('alpha')) === false, 'the second sighting of the same password must be refused')
ok((await d.admit('beta')) === true, 'a different password must be admitted')
ok(d.size === 2, `expected 2 resident entries, got ${d.size}`)

// --- the ceiling is enforced ------------------------------------------------
const capped = new SessionDedup(3)
for (const p of ['a', 'b', 'c', 'd', 'e', 'f']) {
  ok((await capped.admit(p)) === true, `${p} should be admitted on first use`)
  ok(capped.size <= 3, `resident set grew to ${capped.size}, above the cap of 3`)
}
ok(capped.size === 3, `expected the set to sit exactly at its cap of 3, got ${capped.size}`)

// --- eviction is oldest-first, and admitting twice still works --------------
ok((await capped.admit('d')) === false, 'the newest entry must still be refused as a duplicate')
ok((await capped.admit('f')) === false, 'the newest entry must still be refused a second time')
ok((await capped.admit('a')) === true, 'an evicted password is no longer resident and may be admitted again')

// --- realistic bulk run never leaks a repeat --------------------------------
const bulk = new SessionDedup(256)
const seen = new Set()
for (let i = 0; i < 5000; i++) {
  const pw = `pw-${i}-${'x'.repeat(i % 17)}`
  const admitted = await bulk.admit(pw)
  ok(admitted === true, `iteration ${i}: a fresh password was refused`)
  ok(seen.has(pw) === false, `iteration ${i}: the caller emitted a repeat`)
  seen.add(pw)
}
ok(bulk.size === 256, `bulk run should saturate at the cap, got ${bulk.size}`)
ok(seen.size === 5000, 'the generated set itself contained a duplicate')

if (failures.length) {
  console.error('session dedup check FAILED:')
  for (const f of failures.slice(0, 20)) console.error('  - ' + f)
  if (failures.length > 20) console.error(`  ...and ${failures.length - 20} more`)
  process.exit(1)
}
console.log(`session dedup check passed (5000 distinct admissions, cap honoured at ${bulk.size})`)
console.log('SESSION DEDUP VERIFIED')
