/**
 * Per-session duplicate suppression.
 *
 * Randomness already makes a repeat unobservable above the entropy floor, so
 * this exists for the one guarantee randomness cannot self-certify: a visitor
 * should not be shown the same password twice in one sitting. It is a
 * fixed-size in-memory ring, so it costs no network round trip, holds nothing
 * across a reload, and is never persisted.
 *
 * Hashes are kept rather than the passwords themselves so that a heap dump
 * during debugging does not expose live credentials.
 */

const DEFAULT_CAPACITY = 256;

const encoder = new TextEncoder();

async function fingerprint(password: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode(password));
    let out = '';
    for (const byte of new Uint8Array(digest)) out += byte.toString(16).padStart(2, '0');
    return out;
}

export class SessionDedup {
    private readonly capacity: number;
    private readonly resident = new Set<string>();
    private order: string[] = [];

    constructor(capacity: number = DEFAULT_CAPACITY) {
        if (!Number.isInteger(capacity) || capacity < 1) {
            throw new Error(`capacity must be a positive integer, received ${capacity}`);
        }
        this.capacity = capacity;
    }

    get size(): number {
        return this.resident.size;
    }

    /** True when the password is new to this session and is now retained. */
    async admit(password: string): Promise<boolean> {
        const key = await fingerprint(password);
        if (this.resident.has(key)) return false;

        if (this.resident.size >= this.capacity) {
            const evicted = this.order.shift();
            if (evicted !== undefined) this.resident.delete(evicted);
        }

        this.resident.add(key);
        this.order.push(key);
        return true;
    }

    clear(): void {
        this.resident.clear();
        this.order = [];
    }
}
