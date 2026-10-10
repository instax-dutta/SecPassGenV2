// Gate oracle for the keyed (HMAC) password signature.
//
// Verifies against an independent implementation from node:crypto rather than
// against lib/hashing.ts's own arithmetic.
import { createHmac, createHash, randomBytes } from 'node:crypto'
import { keyedHash } from '../lib/hashing.ts'

const failures = []
const ok = (cond, msg) => { if (!cond) failures.push(msg) }

const SECRET = 'k'.repeat(32)
const PW = 'correct horse battery staple'

// known-answer: node:crypto HMAC-SHA-256, base64url, truncated to 128 bits
const expected = createHmac('sha256', SECRET).update(PW).digest('base64url').slice(0, 22)
const actual = await keyedHash(PW, SECRET)
ok(actual === expected, `keyedHash does not match an independent HMAC-SHA-256 (got ${actual}, want ${expected})`)

// the whole point: not a bare digest
ok(actual !== createHash('sha256').update(PW).digest('hex'), 'keyedHash is just a plain SHA-256 with extra steps')
ok(!actual.includes(PW), 'the plaintext password appears in its own signature')

// deterministic per (password, secret)
ok((await keyedHash(PW, SECRET)) === actual, 'keyedHash is not deterministic')

// rotating the secret rotates every signature, so a stolen table ages out
const other = await keyedHash(PW, randomBytes(32).toString('hex'))
ok(other !== actual, 'a different secret produced an identical signature')

// distinguishes different passwords under one secret
ok((await keyedHash(PW + 'x', SECRET)) !== actual, 'two passwords collided under one secret')

// a short secret must be refused rather than silently accepted
let threw = false
try {
  await keyedHash(PW, 'short')
} catch {
  threw = true
}
ok(threw, 'a weak secret must throw instead of producing a weak keyed hash')

if (failures.length) {
  console.error('keyed hash check FAILED:')
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log(`keyed hash check passed (${actual.length} char signature, matches node:crypto HMAC)`)
console.log('KEYED HASH VERIFIED')
