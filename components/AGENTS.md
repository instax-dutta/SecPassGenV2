# components

## Purpose

First-party UI. Everything a visitor sees and touches.

## Ownership

- Owns presentation and client-side interaction for the generator, the history sidebar, the animated background, and the custom checkbox.
- Does not own generation logic. See `../lib/AGENTS.md`.
- Does not own persistence. See `../lib/AGENTS.md`.
- Does not own the vendored primitive set. See `ui/AGENTS.md`.

## Local Contracts

- Every first-party component takes `isDarkMode: boolean` as a prop and derives its own colours from it. Theme is passed down, never read from context.
- `PasswordGenerator` performs generation itself. It calls `generatePassword` from `lib/random.ts` directly and makes no network request of any kind, so a password cannot reach the server even by accident.
- It re-checks `meetsEntropyFloor` locally before drawing, so the guard holds even if the slider is bypassed.
- It pushes every password it accepts into the encrypted history via `addToHistory`.
- `PasswordHistory` renders nothing when `isHistoryAvailable()` returns false, so browsers lacking `crypto.subtle` lose the sidebar silently instead of erroring.
- The history sidebar is `hidden lg:block`, so below the large breakpoint there is no history UI at all. That is a product gap, not a styling detail.

### The generator is the product

`PasswordGenerator` computes `minimumLengthForFlags` from the current checkbox selection and uses it as the slider's `min`, raising the current length when the selection shrinks the alphabet. This exists so the control never offers a configuration the API will refuse with a 400. The floor itself is defined once in `lib/entropy.ts`; the UI must not hardcode 60.

The component also keeps one `SessionDedup` instance in a ref and retries up to `MAX_GENERATION_ATTEMPTS` times, admitting a password only once. See `../lib/AGENTS.md` for why that is a courtesy rather than the uniqueness mechanism.

### Conventions

- Cards are `rounded-2xl` with `backdrop-blur-xl` and a hairline `border-white/10` / `border-black/10`. No drop shadows; one card carrying one broke the elevation language.
- Secondary text sits at 60% ink and notes at 55%. Every text node must clear WCAG AA in both themes; the brass signal is `214 137 62` on black and a darker `143 94 36` on white, because the dark value measures only 2.8:1 on white.
- One theme control, not a sun/switch/moon row, which reads as three controls for one job.
- Motion easing is the cubic bezier `[0.16, 1, 0.3, 1]`, with durations between 0.3 and 0.8 seconds.

## Work Guidance

- User-facing notifications go through `sonner`, whose `Toaster` is already mounted in `app/layout.tsx`. Do not add a second notification system.
- Clipboard writes go through `navigator.clipboard.writeText` and must be wrapped in try/catch.
- Never add a `fetch` to a component. `scripts/check-generation-is-local.mjs` fails the build if one appears, because the moment a password can be posted anywhere the central privacy claim is void.

### Dead code currently in this directory

- `StrengthMeter.tsx` is not imported anywhere. Delete it or wire it into `PasswordGenerator`.

`AnimatedBackground.tsx` binds explicitly typed `surface` and `context` aliases for the canvas because TypeScript narrows a `const` inside arrow closures but not inside a class body. Keep that indirection. It also registers a named `onResize` handler and removes that same reference on cleanup; an inline arrow listener cannot be removed and leaked one handler per theme toggle.

## Verification

## Child DOX Index

- `ui/AGENTS.md` - Vendored shadcn/Radix primitives, their local deviations, and the unused ones
