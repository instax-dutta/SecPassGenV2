/**
 * Character selection.
 *
 * Index selection uses rejection sampling. Taking `draw % alphabetSize` folds
 * the top `2^32 mod N` values of the draw range onto the low indices, so those
 * indices are ever so slightly more likely. The bias is tiny at this alphabet
 * size but it is free to remove: draw until the value falls below the largest
 * multiple of N in range, which makes the map exactly equidistributed.
 */

const UINT32_RANGE = 0x1_0000_0000;
const MAX_DRAWS = 1000;

export type DrawUint32 = () => number

const defaultDraw: DrawUint32 = () => {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0];
};

/**
 * Uniform index in [0, charsetSize).
 *
 * Throws rather than silently falling back to a biased modulo if the source
 * never yields an accepted value. For every alphabet this project uses the
 * rejection probability is under 1e-8, so reaching the cap means the source is
 * broken, not unlucky.
 */
export function randomIndex(charsetSize: number, draw: DrawUint32 = defaultDraw): number {
    if (!Number.isInteger(charsetSize) || charsetSize <= 0) {
        throw new Error(`charsetSize must be a positive integer, received ${charsetSize}`);
    }

    const limit = UINT32_RANGE - (UINT32_RANGE % charsetSize);
    let draws = 0;

    for (;;) {
        const value = draw();
        if (Number.isInteger(value) && value >= 0 && value < limit) {
            return value % charsetSize;
        }
        draws += 1;
        if (draws >= MAX_DRAWS) {
            throw new Error(`character selection found no acceptable draw in ${MAX_DRAWS} attempts`);
        }
    }
}

export function generatePassword(
    charset: string,
    length: number,
    draw: DrawUint32 = defaultDraw
): string {
    if (charset.length === 0) {
        throw new Error('cannot generate a password from an empty character set');
    }
    if (!Number.isInteger(length) || length < 1) {
        throw new Error(`length must be a positive integer, received ${length}`);
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset[randomIndex(charset.length, draw)];
    }
    return password;
}

/**
 * `count` passwords that are pairwise distinct within this call.
 *
 * This is the in-request guard. It costs nothing and removes the overwhelmingly
 * common duplicate, which is two identical draws inside one batch. Collisions
 * against previously issued passwords are handled by the entropy floor and by
 * the caller through the server-side session ledger.
 */
export function generateDistinctPasswords(
    charset: string,
    length: number,
    count: number,
    draw: DrawUint32 = defaultDraw
): string[] {
    const produced = new Set<string>();
    const passwords: string[] = [];

    while (passwords.length < count) {
        const candidate = generatePassword(charset, length, draw);
        if (produced.has(candidate)) continue;
        produced.add(candidate);
        passwords.push(candidate);
    }

    return passwords;
}
