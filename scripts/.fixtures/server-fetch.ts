// Fixture holding the exact server round-trip that was removed. Used only as a
// positive control by scripts/check-generation-is-local.mjs. Never imported.
export async function request(length: number) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ length, count: 1 }),
  })
  return response.json()
}