# app/api

## Purpose

The server-side HTTP surface. This is the only place in the codebase where a password is generated.

## Ownership

- Owns request validation, character-set construction, the entropy floor decision, collision handling, and the public stats counter.
- Runs in the server runtime only. Nothing here may be imported into a `'use client'` module.
- Does not own the algorithm itself. Entropy accounting and character selection live in `../../lib/AGENTS.md`.

## Local Contracts

### Endpoints

- `POST /api/generate` accepts `{length, count, includeUppercase, includeLowercase, includeNumbers, includeSymbols}` and returns `{passwords: string[], count, entropyBits, recorded, message}`.
- `GET /api/stats` returns `{totalGenerated, lastUpdated}` and is marked `export const dynamic = 'force-dynamic'` so it is never cached.

A 400 from `/api/generate` carries `{error, bits, requiredBits, minimumLength}` for the entropy case. The client reads `error`; the rest is there so a caller can explain itself without recomputing.

### Validation bounds

- `length` must be an integer 8 to 128 inclusive.
- `count` must be an integer 1 to 10 inclusive.
- At least one character class must be enabled.

The client currently only ever sends `count: 1`. Nothing stops a caller from asking for 10.

### The entropy floor is the uniqueness guarantee

Configurations below 60 bits are rejected before any database access. This is deliberate and is the core of the design.

- Above the floor, collision probability after `k` earlier passwords is about `k / 2^(L log2 N)`. At 12 characters over the full 90-symbol set that is roughly `2^77.9`, so a repeat is unobservable without consulting anything.
- Below the floor, a uniqueness lookup was the only thing standing between the product and a duplicate, and that same corner is where stored signatures were brute-forceable.
- The 400 must be returned before `recordPassword` is reached so a database outage cannot change whether a weak request is refused. `scripts/check-route-integration.mjs` proves this by running against an unreachable database.

### Recording is a cross-check, not the oracle

`recordPassword` issues one `INSERT ... ON CONFLICT (password_hash) DO NOTHING RETURNING id`. A false return means the signature was already recorded, so the candidate is discarded and redrawn, bounded by `MAX_COLLISION_RETRIES * MAX_COUNT`.

Two properties are load-bearing and must not regress:

- The insert is awaited. It previously fired without `await`, so a frozen serverless instance silently dropped rows and those passwords became permanently re-issuable.
- The uniqueness decision comes from the write, not from a prior read. The old probe-then-insert pair let two concurrent requests both observe "unused".

### Failure handling

A database error must never fail the request. `recordPassword` failures set `recorded: false`, are logged, and the loop continues serving strong passwords. The response reports the degraded state in the `recorded` field so it is observable rather than silent.

A missing or weak `UNIQUENESS_SECRET` is the one configuration error that disables recording, because there is no safe default to fall back to. It logs and degrades the same way rather than returning a 500.

### Client address

Read from `x-forwarded-for`, then `x-real-ip`, then the literal `"unknown"`, and hash it with `resolveIpPepper()`. Never log or persist the raw address. A failure to pepper is non-fatal and drops the field.

## Work Guidance

- Every field is attacker-controlled. The endpoint is public and unauthenticated.
- The response shape is consumed by `components/PasswordGenerator.tsx`. Renaming a field breaks the UI.
- Do not reintroduce a per-candidate database query. The whole point of the entropy floor is that uniqueness does not need one.

## Verification

`scripts/check-route-integration.mjs` exercises this directory against a running dev server. It is part of the root ledger; see `../../GATES.md`.

## Child DOX Index
