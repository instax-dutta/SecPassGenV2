// Gate oracle: the biased-modulo fixture used as a positive control by
// scripts/check-random-sampling.mjs. This file must never be imported.
const charset = 'abcdefghijklmnopqrstuvwxyz'
export function biased(length: number): string {
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  let out = ''
  for (let i = 0; i < length; i++) {
    out += charset[array[i] % charset.length]
  }
  return out
}
