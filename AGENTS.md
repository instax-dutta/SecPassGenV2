# DOX framework

- DOX is highly performant AGENTS.md hierarchy installed here
- Agent must follow DOX instructions across any edits

## Project

- **Product**: SecPassGen Pro, a browser-based password generator. Live at `https://passwords.sdad.pro`; parent domain `https://sdad.pro`.
- **Stack**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Framer Motion, Lenis, Radix UI / shadcn.
- **Persistence**: none. Passwords are generated in the browser and never leave the device. There is no database, no API route, and no server-side state.
- **Install**: `npm install --legacy-peer-deps`
- **Commands**: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`
- **Env vars**: `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_MAIN_DOMAIN`, both cosmetic. Every other variable has been deleted from the Vercel project. Nothing is required: the app builds and runs with a completely empty environment.
- **Docs**: this AGENTS.md tree replaces the former `.agent/architecture.toon` and `.agent/codebase.toon`.

## Product Invariants

These hold across every directory. Breaking one breaks a published privacy claim.

- A password never leaves the browser. There is no route to send it anywhere, and reintroducing one voids this claim outright.
- Nothing derived from a password is persisted, server-side or otherwise. The only storage is encrypted local history in `local/passwordHistory.ts`, which expires in 24 hours.
- If any password-derived artifact is ever added that leaves the browser, it must be non-reversible by a holder of that artifact alone: a keyed HMAC, never a bare digest. A bare SHA-256 of a short lowercase password is a dictionary-attack target.
- Uniqueness comes from an enforced 60-bit entropy floor, not from a lookup against anything. Do not reintroduce a stored set of issued passwords.
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
- `GATES.md` at the repository root is a completion ledger for the stateless-generation work. Each gate is a repository-owned Node script under `scripts/`, and every absence check carries a positive-control fixture in `scripts/.fixtures/` so a detector that cannot fire is caught at authoring time. Run the scripts directly as `node scripts/check-*.mjs`.
- The absence gates in `check-no-server-state.mjs` and `check-generation-is-local.mjs` are the ones that would notice an unwanted server or network path reappearing. Both were proven able to fail by fault injection, not merely by inspection.

## User Preferences

- Documentation lives in this AGENTS.md tree only. Do not introduce a parallel documentation format; the former `.agent/architecture.toon` and `.agent/codebase.toon` were retired in favour of DOX.
- No emojis in documentation. Use dashes rather than em dashes.
- When the user requests a durable behaviour change, record it here or in the relevant child AGENTS.md.

## Child DOX Index

- `app/AGENTS.md` - App Router surface: root layout, metadata and JSON-LD, sitemap, global CSS, viewport-locked home page
- `components/AGENTS.md` - First-party UI: generator, encrypted history sidebar, animated background, custom inputs
- `components/ui/AGENTS.md` - Vendored shadcn/Radix primitives and local deviations from upstream
- `hooks/AGENTS.md` - Shared React hooks: `useIsMobile` and the toast reducer
- `lib/AGENTS.md` - Server-only database access and client-only encrypted history storage
- `public/AGENTS.md` - Static assets, crawler policy in `robots.txt`, PWA manifest
