// Gate oracle for uniform character selection.
//
// Two separate claims are checked:
//   1. randomIndex is uniform *by construction* (the residue range is excluded)
//   2. no unconditional-modulo indexing survives anywhere in the source
//
// Claim 2 is an absence check, so it runs against a known positive fixture first.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { randomIndex, generatePassword } from '../lib/random.ts'

const failures = []
const ok = (cond, msg) => { if (!cond) failures.push(msg) }

const UINT32_RANGE = 4294967296
const SIZES = [10, 26, 28, 52, 62, 90]

// --- 1. uniformity by construction ----------------------------------------
// For the map v -> v % m to be exactly equidistributed over the accepted draw
// range, the range length must be an exact multiple of m. That is the whole
// property; it does not depend on sampling luck.
for (const m of SIZES) {
  const residue = UINT32_RANGE % m
  const limit = UINT32_RANGE - residue
  ok(limit % m === 0, `charset size ${m}: accepted range is not a multiple of the alphabet, so selection cannot be uniform`)
}

// the accepted range must actually be smaller than the full draw range,
// otherwise there is nothing being rejected and the guard is vacuous
for (const m of SIZES) {
  ok(UINT32_RANGE % m > 0, `charset size ${m}: 2^32 is an exact multiple, so rejection sampling is a no-op here`)
}

// --- 2. the residue range is genuinely rejected ---------------------------
const m = 90
const residue = UINT32_RANGE % m
const limit = UINT32_RANGE - residue
let calls = 0
const drawFrom = (seq) => () => seq[calls++ < seq.length ? Math.min(calls - 1, seq.length - 1) : seq.length - 1]

ok(randomIndex(m, drawFrom([limit - 1])) === (limit - 1) % m, 'a draw at the last accepted value must be used')
ok(calls === 1, 'an accepted draw must not trigger a redraw')

calls = 0
ok(randomIndex(m, drawFrom([limit, 5])) === 5 % m, 'a draw inside the residue range must be discarded and redrawn')
ok(calls === 2, `the residue value should have forced exactly one redraw, saw ${calls} draws`)

calls = 0
ok(randomIndex(m, drawFrom([UINT32_RANGE - 1, 7])) === 7 % m, 'the maximum uint32 must be discarded')
ok(calls === 2, 'the maximum uint32 should have forced exactly one redraw')

// a permanently-rejecting source must fail loudly rather than silently fall
// back to the biased modulo that this change exists to remove
let threw = false
try {
  randomIndex(m, () => limit + 1)
} catch {
  threw = true
}
ok(threw, 'a source that never yields an accepted value must throw, not return a biased index')

// --- 3. statistical sanity over the real generator ------------------------
const SAMPLES = 400000
const counts = new Array(m).fill(0)
const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|:;<>,.?/~-='
let failuresFromSampling = 0
for (let i = 0; i < SAMPLES; i++) {
  const ch = randomIndex(m)
  if (ch < 0 || ch >= m) failuresFromSampling++
  else counts[ch]++
}
ok(failuresFromSampling === 0, 'randomIndex returned an out-of-range index')

const expected = SAMPLES / m
let chi2 = 0
let minCount = Infinity
let maxCount = 0
for (const c of counts) {
  const d = c - expected
  chi2 += (d * d) / expected
  if (c < minCount) minCount = c
  if (c > maxCount) maxCount = c
}
// 89 degrees of freedom, p=1e-6 critical value is ~157. A real skew shows up
// in the thousands, so this catches gross errors without being flaky.
ok(chi2 < 157, `character distribution is skewed (chi-square ${chi2.toFixed(1)} over 89 df, expected under 157)`)
ok(maxCount - minCount < expected * 0.12, `per-symbol counts spread too widely (min ${minCount}, max ${maxCount}, mean ${expected.toFixed(0)})`)

// --- 4. generated passwords have the requested length and alphabet --------
for (const len of [8, 16, 64, 128]) {
  const pw = generatePassword(charset, len)
  ok(pw.length === len, `generatePassword returned ${pw.length} chars, requested ${len}`)
  for (const c of pw) ok(charset.includes(c), `generatePassword emitted a character outside the alphabet: ${c}`)
}

// --- 5. absence of the old biased indexing, with a positive control -------
const PATTERN = /%\s*charset\.length/
const sourceFiles = []
const SKIP = new Set(['node_modules', '.next', '.git', '.fixtures', '.unlazy'])
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(ts|tsx|js|mjs)$/.test(entry)) sourceFiles.push(p)
  }
}
walk(process.cwd())

const offenders = sourceFiles.filter((f) => PATTERN.test(readFileSync(f, 'utf8')))
ok(offenders.length === 0, `unconditional modulo indexing still present in: ${offenders.join(', ')}`)

// positive control: the identical detector must fire on a known-bad fixture,
// otherwise the absence result above proves nothing
const control = join(process.cwd(), 'scripts', '.fixtures', 'biased-modulo.ts')
ok(PATTERN.test(readFileSync(control, 'utf8')), 'POSITIVE CONTROL FAILED: the biased-modulo detector no longer matches its own fixture')

if (failures.length) {
  console.error('random sampling check FAILED:')
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log(`random sampling check passed (chi-square ${chi2.toFixed(2)}/89df, ${SAMPLES} draws, control fired)`)
console.log('RANDOM SAMPLING VERIFIED')
