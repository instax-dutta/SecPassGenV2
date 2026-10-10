# components/ui

## Purpose

Vendored shadcn/ui and Radix primitives shared across the app.

## Ownership

- Owns the primitive set that every consumer builds on. A change here ripples outward.
- Origin is upstream shadcn/ui. `components.json` at the repo root defines the aliases and style.
- Does not own product components. See `../AGENTS.md`.

## Local Contracts

- Treat these files as vendored code. Do not refactor them for style or rename their props.
- Limit local edits to what this app actually needs, and leave a comment explaining any deviation from upstream so a future `shadcn add` does not silently revert it.
- Primitives are theme-agnostic and read CSS variables rather than an `isDarkMode` prop. Do not add theme props to a primitive; that is how the first-party components differ.
- `components/ui/use-toast.ts` and `components/ui/use-mobile.tsx` are byte-identical duplicates of the modules in `/hooks`, and neither copy here is imported. The canonical modules are `@/hooks/use-toast` and `@/hooks/use-mobile`. Delete the duplicates here.

## Work Guidance

- Add new primitives with `npx shadcn@latest add <component>`, then read the diff before committing.
- Many shipped primitives are unused: `accordion`, `avatar`, `breadcrumb`, `calendar`, `carousel`, `chart`, `command`, `drawer`, `dropdown-menu`, `hover-card`, `input-otp`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `switch`, `table`, `tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`. Removing unused ones is safe and shrinks review surface. Verify with a grep before deleting, since several are reachable through `sonner.tsx` and `toast.tsx`.
- `sonner.tsx` calls `useTheme()` from `next-themes` but no provider is mounted, so its theme is permanently the `"system"` default. Fix or remove it together with the dark mode work noted in `../../app/AGENTS.md`.

## Verification

## Child DOX Index
