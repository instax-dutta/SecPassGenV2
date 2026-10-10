/**
 * Keyed hashing for anything derived from a secret-adjacent value.
 *
 * Every artifact this module produces must be non-reversible by a holder of the
 * artifact alone. A bare SHA-256 does not qualify: the preimage space of a
 * short lowercase password is small enough to exhaust on a consumer GPU, so an
 * unsalted digest turns a database dump into a list of recovered passwords.
 * HMAC under a server-held secret removes that: without the secret the digest
 * is not a password hash at all.
 */

const MIN_SECRET_LENGTH = 32;
const MIN_PEPPER_LENGTH = 16;
const SIGNATURE_CHARS = 22;

const encoder = new TextEncoder();

function toHex(bytes: Uint8Array): string {
    let out = '';
    for (const byte of bytes) out += byte.toString(16).padStart(2, '0');
    return out;
}

function toBase64Url(bytes: Uint8Array): string {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmacSha256(secret: string, message: string): Promise<Uint8Array> {
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    return new Uint8Array(mac);
}

/**
 * Reads the secret used to sign password signatures.
 *
 * There is deliberately no fallback. A default constant would look like the
 * secret is configured while making every stored signature reproducible by
 * anyone holding the database, which is the exact failure this replaced.
 */
export function requireUniquenessSecret(): string {
    const secret = process.env.UNIQUENESS_SECRET;
    if (!secret) {
        throw new Error(
            'UNIQUENESS_SECRET is not set. Refusing to fall back to a default, because that would make every stored signature reproducible from a database dump.'
        );
    }
    if (secret.length < MIN_SECRET_LENGTH) {
        throw new Error(
            `UNIQUENESS_SECRET must be at least ${MIN_SECRET_LENGTH} characters, received ${secret.length}.`
        );
    }
    return secret;
}

/** Pepper for client-address hashing. Falls back to a domain-separated use of the main secret. */
export function resolveIpPepper(): string {
    const pepper = process.env.IP_PEPPER;
    if (pepper && pepper.length >= MIN_PEPPER_LENGTH) return pepper;
    return requireUniquenessSecret();
}

/**
 * 128+ bit signature of a password under the server secret.
 *
 * Deterministic, so the same password always maps to the same signature and the
 * unique constraint still detects a repeat.
 */
export async function keyedHash(value: string, secret: string): Promise<string> {
    if (typeof secret !== 'string' || secret.length < MIN_SECRET_LENGTH) {
        throw new Error(`keyedHash requires a secret of at least ${MIN_SECRET_LENGTH} characters.`);
    }
    const mac = await hmacSha256(secret, value);
    return toBase64Url(mac).slice(0, SIGNATURE_CHARS);
}

/**
 * Anonymised client address.
 *
 * The salt is an explicit, required argument. It used to be read from the
 * environment inline as `ip + process.env.IP_SALT || 'default-salt'`, which
 * parses as `(ip + IP_SALT) || 'default-salt'`: an unset IP_SALT silently
 * became the literal string "undefined" and the fallback never ran.
 */
export async function hashIP(ip: string, pepper: string): Promise<string> {
    if (typeof pepper !== 'string' || pepper.length === 0) {
        throw new Error('hashIP requires an explicit non-empty pepper.');
    }
    return toHex(await hmacSha256(pepper, `secpassgen:ip:${ip}`));
}
