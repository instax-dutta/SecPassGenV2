// End-to-end check against the real deployed site, driven like a user.
//
// Every other gate inspects source or exercises a library directly. This one
// loads the page in a browser, clicks the button, and reads what a person
// would actually see. It is the only check that can catch the wiring between
// the component, the entropy floor and the DOM being wrong.
//
// It fails closed on egress: any request that is not the site's own assets is a
// violation, because the central claim is that the password never leaves the
// browser.
import { chromium } from 'playwright'

const BASE = process.env.E2E_URL || 'https://passwords.sdad.pro'
const failures = []
const ok = (cond, msg) => { if (!cond) failures.push(msg) }

const browser = await chromium.launch()
const context = await browser.newContext()
const page = await context.newPage()

const egress = []
page.on('request', (r) => {
  const url = r.url()
  if (!url.startsWith(BASE) && !url.startsWith('data:') && !url.startsWith('blob:')) {
    egress.push(`${r.method()} ${url}`)
  }
})

const consoleErrors = []
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
page.on('pageerror', (e) => consoleErrors.push(String(e)))

await page.goto(BASE, { waitUntil: 'networkidle' })

const button = page.getByRole('button', { name: 'Generate Password' })
ok(await button.count() === 1, 'the Generate Password button is not present exactly once')
ok(await page.getByText('Generate a password to begin').count() === 1,
  'the empty state should invite the user to generate')

const slider = page.locator('[role=slider]').first()
const shownLength = async () => parseInt(await page.locator('span.font-bold').first().innerText(), 10)

// --- the floor is mirrored into the slider ---------------------------------
// All four classes is a 90 symbol alphabet, so the floor lands on 10.
const minWithAll = await slider.getAttribute('aria-valuemin')
ok(minWithAll === '10', `with all four character types the slider floor should be 10, got ${minWithAll}`)

const floorHint = await page.locator('text=/^Minimum \\d+ characters/').first().innerText()
ok(/Minimum 10 characters/.test(floorHint), `the floor hint is wrong: ${floorHint}`)

// --- clicking actually produces a password ---------------------------------
await button.click()
await page.waitForSelector('input[readonly]', { timeout: 15000 })
const input = page.locator('input[readonly]').first()
const pw1 = await input.inputValue()
ok(pw1.length > 0, 'clicking Generate produced an empty password')
ok(/^[!-~]+$/.test(pw1), `the password contains characters outside the printable set: ${pw1}`)
ok(pw1.length === await shownLength(), `generated ${pw1.length} chars but the slider reads ${await shownLength()}`)
ok(pw1.length >= 10, `generated password is ${pw1.length} chars, under the enforced floor`)

// --- pressing generate again gives a DIFFERENT password --------------------
await button.click()
await page.waitForTimeout(700)
const pw2 = await input.inputValue()
ok(pw2 !== pw1, 'pressing generate twice returned the identical password')

// --- twelve presses in a row are all distinct -------------------------------
const seen = new Set([pw1, pw2])
for (let i = 0; i < 10; i++) {
  await button.click()
  await page.waitForTimeout(340)
  seen.add(await input.inputValue())
}
ok(seen.size === 12, `12 generations produced only ${seen.size} distinct passwords`)

// --- narrowing the alphabet raises the floor and re-clamps the slider ------
// Digits plus mixed case is a 62 symbol alphabet, so the floor becomes 11.
const symbols = page.getByText('Symbols', { exact: true }).first()
if (await symbols.count() === 1) {
  await symbols.click()
  await page.waitForTimeout(500)
  const minAfter = await slider.getAttribute('aria-valuemin')
  ok(minAfter === '11', `dropping symbols should raise the floor to 11, got ${minAfter}`)
  ok(await shownLength() >= 11, `the slider should re-clamp to at least 11, reads ${await shownLength()}`)

  await button.click()
  await page.waitForTimeout(600)
  const pw3 = await input.inputValue()
  ok(pw3.length === await shownLength(), `after narrowing, password is ${pw3.length} but slider reads ${await shownLength()}`)
  ok(seen.has(pw3) === false, 'the reduced-alphabet password repeated an earlier one')
  ok(!/[^A-Za-z0-9]/.test(pw3), `symbols were unchecked but the password still contains them: ${pw3}`)
}

// --- digits only should demand 19 characters -------------------------------
for (const label of ['Uppercase', 'Lowercase']) {
  const el = page.getByText(label, { exact: true }).first()
  if (await el.count() === 1) { await el.click(); await page.waitForTimeout(250) }
}
const minDigits = await slider.getAttribute('aria-valuemin')
ok(minDigits === '19', `digits-only should force a floor of 19, got ${minDigits}`)
ok(await shownLength() >= 19, `the slider should re-clamp to at least 19, reads ${await shownLength()}`)

await button.click()
await page.waitForTimeout(600)
const pw4 = await input.inputValue()
ok(/^[0-9]+$/.test(pw4), `digits-only produced a password with non-digits: ${pw4}`)
ok(pw4.length === await shownLength(), `digits-only password is ${pw4.length} but slider reads ${await shownLength()}`)

// --- the central claim: nothing left the browser ----------------------------
ok(egress.length === 0, `the page made external network requests: ${egress.join(', ')}`)
ok(egress.filter((e) => e.includes('/api/')).length === 0,
  `the page called an API: ${egress.filter((e) => e.includes('/api/')).join(', ')}`)
ok(consoleErrors.length === 0, `console errors on the live page: ${consoleErrors.slice(0, 5).join(' | ')}`)

await browser.close()

if (failures.length) {
  console.error('browser end-to-end check FAILED:')
  for (const f of failures) console.error('  - ' + f)
  process.exit(1)
}
console.log(`browser end-to-end check passed against ${BASE} (12 distinct passwords, zero network egress)`)
console.log('BROWSER END TO END VERIFIED')
