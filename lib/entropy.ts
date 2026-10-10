/**
 * Entropy accounting for password configurations.
 *
 * A uniformly drawn password over an alphabet of size N and length L carries
 * L * log2(N) bits. Collision probability after k earlier passwords from the
 * same space is approximately k / 2^(L*log2 N), so enforcing a floor on
 * L * log2(N) is what makes a duplicate unobservable. The database check that
 * used to run per request only mattered below this floor, and below it the
 * stored signatures were brute-forceable, so the floor replaces both.
 */

export const CHARSETS = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+{}[]|:;<>,.?/~-=',
} as const

export const MIN_ENTROPY_BITS = 60
export const MIN_LENGTH = 8
export const MAX_LENGTH = 128

export interface CharsetFlags {
    includeUppercase: boolean
    includeLowercase: boolean
    includeNumbers: boolean
    includeSymbols: boolean
}

export function buildCharset(flags: CharsetFlags): string {
    let charset = '';
    if (flags.includeLowercase) charset += CHARSETS.lowercase;
    if (flags.includeUppercase) charset += CHARSETS.uppercase;
    if (flags.includeNumbers) charset += CHARSETS.numbers;
    if (flags.includeSymbols) charset += CHARSETS.symbols;
    return charset;
}

export function entropyBits(alphabetSize: number, length: number): number {
    if (alphabetSize <= 0) return 0;
    return length * Math.log2(alphabetSize);
}

export function totalEntropy(flags: CharsetFlags, length: number): number {
    return entropyBits(buildCharset(flags).length, length);
}

export function meetsEntropyFloor(flags: CharsetFlags, length: number): boolean {
    return totalEntropy(flags, length) >= MIN_ENTROPY_BITS;
}

/**
 * Smallest length that clears the floor, or Infinity when no alphabet is
 * selected. Kept next to `meetsEntropyFloor` so the two cannot drift apart.
 */
export function minimumLengthForFlags(flags: CharsetFlags): number {
    const alphabetSize = buildCharset(flags).length;
    if (alphabetSize === 0) return Number.POSITIVE_INFINITY;
    return Math.ceil(MIN_ENTROPY_BITS / Math.log2(alphabetSize));
}
