// Gate oracle for the entropy floor.
// Measures against independently transcribed character-set literals rather than
// trusting whatever lib/entropy.ts happens to export.
import {
  buildCharset,
  totalEntropy,
  minimumLengthForFlags,
  meetsEntropyFloor,
  MIN_ENTROPY_BITS,
} from '../lib/entropy.ts'

// Independently transcribed from the published contract in app/api/AGENTS.md.
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMS = '0123456789'
const SYMS = '!@#$%^&*()_+{}[]|:;<>,.?/~-='

const all = { includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: true }
const digitsOnly = { includeUppercase: false, includeLowercase: false, includeNumbers: true, includeSymbols: false }
const lowerOnly = { includeUppercase: false, includeLowercase: true, includeNumbers: false, includeSymbols: false }
const alpha = { includeUppercase: true, includeLowercase: true, includeNumbers: false, includeSymbols: false }
const alnum = { includeUppercase: true, includeLowercase: true, includeNumbers: true, includeSymbols: false }
const none = { includeUppercase: false, includeLowercase: false, includeNumbers: false, includeSymbols: false }

const failures = []
const ok = (cond, msg) => { if (!cond) failures.push(msg) }
const near = (a, b, eps, msg) => ok(Math.abs(a - b) < eps, `${msg} (got ${a}, want ~${b})`)

// --- the character sets themselves must match the contract exactly ----------
ok(buildCharset(lowerOnly) === LOWER, 'lowercase charset drifted from contract')
ok(buildCharset({ includeUppercase: true, includeLowercase: false, includeNumbers: false, includeSymbols: false }) === UPPER, 'uppercase charset drifted')
ok(buildCharset(digitsOnly) === NUMS, 'digit charset drifted')
ok(buildCharset({ includeUppercase: false, includeLowercase: false, includeNumbers: false, includeSymbols: true }) === SYMS, 'symbol charset drifted')
ok(buildCharset(all) === LOWER + UPPER + NUMS + SYMS, 'combined charset is not the ordered concatenation of its parts')
ok(buildCharset(none) === '', 'empty flag set must yield an empty charset')

const SIZE_ALL = LOWER.length + UPPER.length + NUMS.length + SYMS.length
ok(SIZE_ALL === 90, `expected the full charset to hold 90 symbols, transcribed ${SIZE_ALL}`)

// --- entropy must equal length * log2(alphabet), computed here -------------
ok(MIN_ENTROPY_BITS === 60, `MIN_ENTROPY_BITS must be 60, got ${MIN_ENTROPY_BITS}`)
near(totalEntropy(all, 16), 16 * Math.log2(SIZE_ALL), 1e-9, 'totalEntropy(all,16) is not length*log2(size)')
near(totalEntropy(digitsOnly, 19), 19 * Math.log2(10), 1e-9, 'totalEntropy(digits,19) is not length*log2(10)')

// --- the floor must actually reject the weak corner ------------------------
ok(meetsEntropyFloor(lowerOnly, 8) === false, '8 chars of lowercase alone must be rejected')
ok(meetsEntropyFloor(digitsOnly, 12) === false, '12 digits must be rejected')
ok(meetsEntropyFloor(all, 9) === false, '9 chars of the full set must be rejected')
ok(meetsEntropyFloor(none, 64) === false, 'an empty character set must never satisfy the floor')

// --- ...and must accept everything at or above it -------------------------
ok(meetsEntropyFloor(all, 10) === true, '10 chars of the full set must be accepted')
ok(meetsEntropyFloor(digitsOnly, 19) === true, '19 digits must be accepted')
ok(meetsEntropyFloor(lowerOnly, 13) === true, '13 lowercase chars must be accepted')

// --- the reported minimum length must be the true smallest passing length --
ok(minimumLengthForFlags(all) === 10, `minimum length for full set should be 10, got ${minimumLengthForFlags(all)}`)
ok(minimumLengthForFlags(digitsOnly) === 19, `minimum length for digits should be 19, got ${minimumLengthForFlags(digitsOnly)}`)
ok(minimumLengthForFlags(lowerOnly) === 13, `minimum length for lowercase should be 13, got ${minimumLengthForFlags(lowerOnly)}`)
ok(minimumLengthForFlags(alpha) === 11, `minimum length for mixed case should be 11, got ${minimumLengthForFlags(alpha)}`)
ok(minimumLengthForFlags(alnum) === 11, `minimum length for alnum should be 11, got ${minimumLengthForFlags(alnum)}`)

// exhaustive agreement between the two helpers, so they cannot drift apart
for (const [name, flags] of Object.entries({ all, digitsOnly, lowerOnly, alpha, alnum })) {
  const m = minimumLengthForFlags(flags)
  ok(m >= 1 && m <= 128, `${name}: minimum length ${m} outside the API's 8..128 range`)
  ok(meetsEntropyFloor(flags, m) === true, `${name}: its own reported minimum ${m} does not pass the floor`)
  ok(m === 1 || meetsEntropyFloor(flags, m - 1) === false, `${name}: ${m} is not minimal, ${m - 1} also passes`)
}

// --- known-answer vectors: the exact bit counts quoted in the writeup -----
near(totalEntropy(lowerOnly, 8), 37.603, 1e-2, '8 lowercase chars should be ~37.6 bits')
near(totalEntropy(all, 9), 58.427, 1e-2, '9 full-set chars should be ~58.4 bits, under the floor')
near(totalEntropy(all, 10), 64.919, 1e-2, '10 full-set chars should be ~64.9 bits, over the floor')
near(totalEntropy(all, 12), 77.902, 1e-2, '12 full-set chars should be ~77.9 bits')
near(totalEntropy(all, 16), 103.870, 1e-2, '16 full-set chars should be ~103.9 bits')

if (failures.length) {
  console.error('entropy floor check FAILED:')
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log(`entropy floor check passed (floor=${MIN_ENTROPY_BITS} bits, full charset=${SIZE_ALL} symbols)`)
console.log('ENTROPY FLOOR VERIFIED')
