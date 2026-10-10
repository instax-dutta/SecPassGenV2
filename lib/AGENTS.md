# lib

## Purpose

Domain logic that is neither a route nor a component: entropy accounting, character selection, session-level duplicate suppression, and browser storage. Everything here runs in the browser.

## Ownership

- `entropy.ts` - Character sets, the 60-bit floor, and minimum-length arithmetic. Pure, no runtime dependency.
- `random.ts` - Uniform character selection and password construction. Pure apart from `crypto.getRandomValues`.
- `sessionDedup.ts` - Per-session duplicate suppression.
- `passwordHistory.ts` - Encrypted browser-side history. Browser-only.
- `utils.ts` - The `cn` class-name helper. Runtime-agnostic.

## Local Contracts

### Everything in this directory is browser code

Every module runs in the visitor's browser. None may read `process.env`, open a network connection, or be imported by anything server-side. There is no longer a server/browser split here because there is no server.

### Relative imports carry an explicit extension

Modules are imported with an explicit `.ts` extension where a verification script loads them directly in Node, which resolves neither the `@/` alias nor bare specifiers. `tsconfig.json` sets `allowImportingTsExtensions` to permit this.

### Entropy floor

`MIN_ENTROPY_BITS` is 60 and lives in `entropy.ts`. Every configuration below it is refused by the API and unreachable from the UI slider.

- `minimumLengthForFlags` and `meetsEntropyFloor` must agree. A change to one without the other is a defect, and `scripts/check-entropy-floor.mjs` cross-checks them exhaustively.
- The full character set is 90 symbols, not 94. Anyone reasoning about collision bounds with the wrong figure will be off by roughly 1 bit per character.

### Character selection

`random.ts` uses rejection sampling. `draw % alphabetSize` is banned: it folds the top `2^32 mod N` values onto the low indices. `randomIndex` throws rather than falling back to a biased modulo if the draw source never yields an accepted value, because a silent bias fallback would reintroduce exactly the defect this replaced.

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
- Anything derived from a password that would ever leave the browser must be non-reversible without a secret you control. Reach for HMAC, not a bare digest.
- New generation logic belongs in `entropy.ts` or `random.ts`, never inline in a route or component.

## Verification

`scripts/` holds the machine-checkable contracts for this directory. Run them directly, or through the ledger at the repository root:

```text
node scripts/check-entropy-floor.mjs
node scripts/check-random-sampling.mjs
node scripts/check-session-dedup.mjs
node scripts/check-no-server-state.mjs
node scripts/check-generation-is-local.mjs
```

## Child DOX Index
