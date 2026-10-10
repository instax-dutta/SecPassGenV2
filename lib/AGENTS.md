# lib

## Purpose

Domain logic that is neither a route nor a component: entropy accounting, character selection, keyed hashing, database access, session-level duplicate suppression, and browser storage.

## Ownership

- `entropy.ts` - Character sets, the 60-bit floor, and minimum-length arithmetic. Pure, no runtime dependency.
- `random.ts` - Uniform character selection and password construction. Pure apart from `crypto.getRandomValues`.
- `hashing.ts` - HMAC signing, secret validation, and client-address hashing. Server-only.
- `db.ts` - NeonDB client and every SQL statement in the project. Server-only.
- `sessionDedup.ts` - Per-session duplicate suppression. Browser-only.
- `passwordHistory.ts` - Encrypted browser-side history. Browser-only.
- `utils.ts` - The `cn` class-name helper. Runtime-agnostic.

## Local Contracts

### The runtime split must not blur

- `db.ts` imports `@neondatabase/serverless` and throws at module load when `DATABASE_URL` is unset. Never import it from a `'use client'` module.
- `hashing.ts` reads `process.env` and is server-only.
- `passwordHistory.ts` and `sessionDedup.ts` use `localStorage`, `navigator`, `screen`, and `crypto.subtle`. Browser-only; never import them from an API route.
- `entropy.ts` and `random.ts` are safe in either runtime.

### Relative imports carry an explicit extension

`db.ts` imports `./hashing.ts`, not `./hashing`. The verification scripts under `scripts/` load these modules directly in Node, which does not resolve the `@/` alias and does not infer extensions. `tsconfig.json` sets `allowImportingTsExtensions` to permit this.

### Entropy floor

`MIN_ENTROPY_BITS` is 60 and lives in `entropy.ts`. Every configuration below it is refused by the API and unreachable from the UI slider.

- `minimumLengthForFlags` and `meetsEntropyFloor` must agree. A change to one without the other is a defect, and `scripts/check-entropy-floor.mjs` cross-checks them exhaustively.
- The full character set is 90 symbols, not 94. Anyone reasoning about collision bounds with the wrong figure will be off by roughly 1 bit per character.

### Character selection

`random.ts` uses rejection sampling. `draw % alphabetSize` is banned: it folds the top `2^32 mod N` values onto the low indices. `randomIndex` throws rather than falling back to a biased modulo if the draw source never yields an accepted value, because a silent bias fallback would reintroduce exactly the defect this replaced.

### Keyed hashing

- `requireUniquenessSecret` has no fallback and requires 32+ characters. A default constant would be indistinguishable from a configured secret while making every stored signature reproducible from a database dump.
- `keyedHash` is HMAC-SHA-256 truncated to 22 base64url characters, truncated in `hashing.ts` and nowhere else. Deterministic, so the unique constraint still detects repeats.
- `hashIP` takes its pepper as an explicit required argument. It previously read `process.env.IP_SALT` inline as `ip + process.env.IP_SALT || 'default-salt'`, which parses as `(ip + IP_SALT) || 'default-salt'`: an unset salt silently became the literal string `"undefined"`.

### Database access

- Every statement is schema-qualified with `public.` because Neon does not guarantee a `search_path`.
- `recordPassword` is one `INSERT ... ON CONFLICT DO NOTHING RETURNING id`, and the caller decides collision from `rows.length > 0`. It replaced an `isPasswordUnique` probe plus a separate `savePassword`, which could let two concurrent requests both observe "unused", and whose insert was never awaited.
- `generation_stats` is maintained by the `increment_generation_stats` Postgres trigger on insert into `generated_passwords`. It counts *inserts*, not generations.
- `getGenerationStats` swallows every error and returns a zeroed result, including `42P01` for a missing table. Callers cannot distinguish "no data yet" from "database unreachable".
- The dead `getRecentPasswords` export was removed.

### Session dedup

`SessionDedup` is a fixed 256-entry in-memory ring, so it costs no network round trip, holds nothing across a reload, and is never persisted. It exists only for the guarantee randomness cannot self-certify: the same visitor must not be shown the same password twice in one sitting. Above the entropy floor even that is unobservable, so the ring is a courtesy rather than the uniqueness mechanism.

### Browser history

- Storage key `secpassgen_history`, capped at 10 items, each with a hard 24 hour TTL enforced on read.
- The AES-GCM key is derived by hashing `navigator.userAgent`, `navigator.language`, `screen.width`, and `screen.height`. History is device-specific and becomes permanently unreadable if any of those change.
- That fingerprint is low entropy, so this is obfuscation against casual inspection of `localStorage`, not protection against an attacker who already has the machine. It is not a substitute for a real key. Do not describe it in product copy as protection against a determined local attacker.
- Every function swallows its errors and resolves to an empty result, so callers get no failure signal.
- This module protects passwords at rest in `localStorage` only. Cleartext exists in browser memory and in the DOM while a password is displayed.

## Work Guidance

- Keep `cn` as the only class-name helper.
- Add database access as named exports from `db.ts`. Do not open additional `neon()` clients elsewhere.
- Anything derived from a password that leaves the browser must be non-reversible without a secret you control. Reach for HMAC, not a bare digest.
- New generation logic belongs in `entropy.ts` or `random.ts`, never inline in a route or component.

## Verification

`scripts/` holds the machine-checkable contracts for this directory. Run them directly, or through the ledger at the repository root:

```text
node scripts/check-entropy-floor.mjs
node scripts/check-random-sampling.mjs
node scripts/check-session-dedup.mjs
node scripts/check-hash-ip.mjs
node scripts/check-keyed-hash.mjs
node scripts/check-uniqueness-secret.mjs
node scripts/check-atomic-insert.mjs
```

## Child DOX Index
