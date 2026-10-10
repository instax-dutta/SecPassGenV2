# DOX framework

- DOX is highly performant AGENTS.md hierarchy installed here
- Agent must follow DOX instructions across any edits

## Project

- **Product**: SecPassGen Pro, a browser-based password generator. Live at `https://passwords.sdad.pro`; parent domain `https://sdad.pro`.
- **Stack**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Framer Motion, Lenis, Radix UI / shadcn.
- **Persistence**: NeonDB serverless PostgreSQL through `@neondatabase/serverless`.
- **Install**: `npm install --legacy-peer-deps`
- **Commands**: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`
- **Env vars**: `DATABASE_URL`, `UNIQUENESS_SECRET` (required, 32+ characters, generate with `openssl rand -base64 48`), `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_MAIN_DOMAIN`. `IP_PEPPER` is optional and defaults to a domain-separated use of `UNIQUENESS_SECRET`. `RATE_LIMIT_PER_HOUR` is declared in `.env.example` but no rate limiting is implemented anywhere.
- **Schema**: `schema.sql` at the repo root is the source of truth for the database. It is applied by hand in the Neon console; there is no migration runner.
- **Docs**: this AGENTS.md tree replaces the former `.agent/architecture.toon` and `.agent/codebase.toon`.

## Product Invariants

These hold across every directory. Breaking one breaks a published privacy claim.

- No password is ever persisted, logged, or transmitted in plaintext.
- Anything derived from a password that leaves the browser must be non-reversible by a holder of that artifact alone. That means a keyed HMAC under `UNIQUENESS_SECRET`, never a bare digest. A bare SHA-256 of a short lowercase password is a dictionary-attack target. See `lib/AGENTS.md`.
- `UNIQUENESS_SECRET` has no fallback value. A default would be indistinguishable from a configured secret while making every stored signature reproducible from a database dump, so the code refuses to record passwords instead.
- Uniqueness comes from an enforced 60-bit entropy floor, not from a database lookup. Do not reintroduce a per-candidate query.
- Marketing copy, `app/layout.tsx` metadata, and `app/privacy/page.tsx` must describe what the code actually does. Update them in the same change whenever generation, storage, or network behaviour changes.

## Core Contract

- AGENTS.md files are binding work contracts for their subtrees
- Work products, source materials, instructions, records, assets, and durable docs must stay understandable from the nearest applicable AGENTS.md plus every parent AGENTS.md above it

## Read Before Editing

1. Read the root AGENTS.md
2. Identify every file or folder you expect to touch
3. Walk from the repository root to each target path
4. Read every AGENTS.md found along each route
5. If a parent AGENTS.md lists a child AGENTS.md whose scope contains the path, read that child and continue from there
6. Use the nearest AGENTS.md as the local contract and parent docs for repo-wide rules
7. If docs conflict, the closer doc controls local work details, but no child doc may weaken DOX

Do not rely on memory. Re-read the applicable DOX chain in the current session before editing.

## Update After Editing

Every meaningful change requires a DOX pass before the task is done.

Update the closest owning AGENTS.md when a change affects:

- purpose, scope, ownership, or responsibilities
- durable structure, contracts, workflows, or operating rules
- required inputs, outputs, permissions, constraints, side effects, or artifacts
- user preferences about behavior, communication, process, organization, or quality
- AGENTS.md creation, deletion, move, rename, or index contents

Update parent docs when parent-level structure, ownership, workflow, or child index changes. Update child docs when parent changes alter local rules. Remove stale or contradictory text immediately. Small edits that do not change behavior or contracts may leave docs unchanged, but the DOX pass still must happen.

## Hierarchy

- Root AGENTS.md is the DOX rail: project-wide instructions, global preferences, durable workflow rules, and the top-level Child DOX Index
- Child AGENTS.md files own domain-specific instructions and their own Child DOX Index
- Each parent explains what its direct children cover and what stays owned by the parent
- The closer a doc is to the work, the more specific and practical it must be

## Child Doc Shape

- Create a child AGENTS.md when a folder becomes a durable boundary with its own purpose, rules, responsibilities, workflow, materials, or quality standards
- Work Guidance must reflect the current standards of the project or user instructions; if there are no specific standards or instructions yet, leave it empty
- Verification must reflect an existing check; if no verification framework exists yet, leave it empty and update it when one exists

Default section order:
- Purpose
- Ownership
- Local Contracts
- Work Guidance
- Verification
- Child DOX Index

## Style

- Keep docs concise, current, and operational
- Document stable contracts, not diary entries
- Put broad rules in parent docs and concrete details in child docs
- Prefer direct bullets with explicit names
- Do not duplicate rules across many files unless each scope needs a local version
- Delete stale notes instead of explaining history
- Trim obvious statements, repeated rules, misplaced detail, and warnings for risks that no longer exist

## Closeout

1. Re-check changed paths against the DOX chain
2. Update nearest owning docs and any affected parents or children
3. Refresh every affected Child DOX Index
4. Remove stale or contradictory text
5. Run existing verification when relevant
6. Report any docs intentionally left unchanged and why

## Verification

- `npm run lint` and `npm run build` are the only automated checks the project ships with. There is no test runner and no test script.
- `next.config.mjs` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`. A passing build therefore does **not** mean the code type-checks or lints cleanly. Run `npx tsc --noEmit` and `npm run lint` explicitly whenever types matter. Both were passing as of the entropy-floor change; before it, `npx tsc --noEmit` reported ten pre-existing null-safety errors and `npm run lint` could not run at all because no linter was installed.
- `GATES.md` at the repository root is a completion ledger for the password-uniqueness work. Each gate is a repository-owned Node script under `scripts/`, and the absence checks carry positive-control fixtures in `scripts/.fixtures/`. Run it with the unlazy gate checker, or run the scripts directly as `node scripts/check-*.mjs`.
- `scripts/check-route-integration.mjs` boots a real dev server against an intentionally unreachable database. It proves the entropy floor is enforced before any database access. It takes roughly a minute and needs the port it names to be free.

## User Preferences

- Documentation lives in this AGENTS.md tree only. Do not introduce a parallel documentation format; the former `.agent/architecture.toon` and `.agent/codebase.toon` were retired in favour of DOX.
- No emojis in documentation. Use dashes rather than em dashes.
- When the user requests a durable behaviour change, record it here or in the relevant child AGENTS.md.

## Child DOX Index

- `app/AGENTS.md` - App Router surface: root layout, metadata and JSON-LD, sitemap, global CSS, viewport-locked home page
- `app/api/AGENTS.md` - Password generation and stats endpoints, their request/response contracts, and the uniqueness invariants they are supposed to provide
- `components/AGENTS.md` - First-party UI: generator, encrypted history sidebar, animated background, custom inputs
- `components/ui/AGENTS.md` - Vendored shadcn/Radix primitives and local deviations from upstream
- `hooks/AGENTS.md` - Shared React hooks: `useIsMobile` and the toast reducer
- `lib/AGENTS.md` - Server-only database access and client-only encrypted history storage
- `public/AGENTS.md` - Static assets, crawler policy in `robots.txt`, PWA manifest
