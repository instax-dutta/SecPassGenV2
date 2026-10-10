# hooks

## Purpose

Reusable React hooks shared across components.

## Ownership

- Owns `useIsMobile` and the toast reducer.
- Both are vendored from shadcn/ui and kept here rather than in `components/ui` because that is where the app actually imports them from.
- Does not own the notification system. User-facing toasts go through `sonner`; see `../components/ui/AGENTS.md`.

## Local Contracts

- `hooks/use-toast.ts` and `hooks/use-mobile.tsx` are the canonical modules. The byte-identical copies in `components/ui` are dead; see `../components/ui/AGENTS.md`.
- Consumers: `components/ui/toaster.tsx` imports `@/hooks/use-toast`, and `components/ui/sidebar.tsx` imports `@/hooks/use-mobile`.
- `use-toast` keeps a module-level toast queue with a one second dismissal default. It is a shadcn mechanism and is unrelated to the `sonner` toaster the app actually renders. Do not merge the two.
- `useIsMobile` returns `undefined` on the server and a boolean after mount, so it must be used behind a mounted guard.

## Work Guidance

- Never import these from server components or API routes.
- Keep module scope free of side effects.
- Import through the `@/hooks/...` alias rather than a relative path.

## Verification

## Child DOX Index
