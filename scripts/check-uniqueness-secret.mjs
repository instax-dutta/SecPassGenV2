// Gate oracle: a missing UNIQUENESS_SECRET must fail loudly.
//
// A silent fallback to a hardcoded constant would restore exactly the offline
// cracking exposure this change removes, so "throws" is the required behaviour
// and it has to happen before any database work.
const { requireUniquenessSecret } = await import('../lib/hashing.ts')

const failures = []
const ok = (cond, msg) => { if (!cond) failures.push(msg) }
const ORIGINAL = process.env.UNIQUENESS_SECRET

const attempt = (value) => {
  if (value === undefined) delete process.env.UNIQUENESS_SECRET
  else process.env.UNIQUENESS_SECRET = value
  try {
    return { threw: false, result: requireUniquenessSecret() }
  } catch (e) {
    return { threw: true, message: String((e && e.message) || '') }
  }
}

const missing = attempt(undefined)
ok(missing.threw, 'an unset UNIQUENESS_SECRET must throw, not fall back to a default')
ok(/UNIQUENESS_SECRET/.test(missing.message), `the error must name the missing variable, got: ${missing.message}`)

const empty = attempt('')
ok(empty.threw, 'an empty UNIQUENESS_SECRET must throw')

const weak = attempt('hunter2')
ok(weak.threw, 'a short UNIQUENESS_SECRET must throw; a weak secret is as bad as none')
ok(/32/.test(weak.message), `the error should state the minimum length, got: ${weak.message}`)

const good = attempt('a'.repeat(32))
ok(good.threw === false, `a 32-char secret must be accepted, got: ${good.message}`)
ok(good.result === 'a'.repeat(32), 'the secret must be returned unchanged')

if (ORIGINAL === undefined) delete process.env.UNIQUENESS_SECRET
else process.env.UNIQUENESS_SECRET = ORIGINAL

if (failures.length) {
  console.error('uniqueness secret check FAILED:')
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log('uniqueness secret check passed (missing, empty and weak secrets all rejected)')
console.log('UNIQUENESS SECRET VERIFIED')
