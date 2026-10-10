// Gate oracle for the hashIP operator-precedence defect.
//
// Current defect: `ip + process.env.IP_SALT || 'default-salt'` parses as
// `(ip + IP_SALT) || 'default-salt'`, so an unset salt becomes the literal
// string "undefined" and the intended fallback never fires.
import { createHash } from 'node:crypto'

process.env.DATABASE_URL ||= 'postgresql://gate:gate@127.0.0.1:5432/gate'
const { hashIP } = await import('../lib/db.ts')

const failures = []
const ok = (cond, msg) => { if (!cond) failures.push(msg) }
const sha256 = (s) => createHash('sha256').update(s).digest('hex')

const IP = '203.0.113.7'

// the salt must actually change the result
const a = await hashIP(IP, 'pepper-alpha')
const b = await hashIP(IP, 'pepper-beta')
ok(a !== b, 'two different salts produced the same hash, so the salt is being ignored')
ok(!!a && /^[0-9a-f]{64}$/.test(a), `hashIP must return a 64-char lowercase hex digest, got ${JSON.stringify(a)}`)

// deterministic for a fixed salt
ok((await hashIP(IP, 'pepper-alpha')) === a, 'hashIP is not deterministic for a fixed salt')

// distinct addresses still separate
ok((await hashIP('203.0.113.8', 'pepper-alpha')) !== a, 'different addresses collided under one salt')

// the two failure modes of the original expression, both of which must be gone
ok(a !== sha256(IP + 'undefined'), 'still hashing the literal string "undefined" as the salt')
ok(a !== sha256(IP + 'default-salt'), 'still falling back to the hardcoded "default-salt"')
ok(a !== sha256(IP), 'salt is not being mixed into the digest at all')

// an empty salt must be refused outright rather than silently degrading
let threw = false
try {
  await hashIP(IP, '')
} catch {
  threw = true
}
ok(threw, 'an empty salt must throw, not quietly hash the bare address')

if (failures.length) {
  console.error('hashIP check FAILED:')
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log(`hashIP check passed (salt is load-bearing, ${a.slice(0, 12)}...)`)
console.log('HASHIP SALT VERIFIED')
