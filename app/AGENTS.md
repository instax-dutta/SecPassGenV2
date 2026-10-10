# app

## Purpose

The App Router surface: the HTML shell, published metadata, crawler-facing routes, global stylesheet, and the single-page home experience. There is no `app/api` directory; the app serves no server routes.

## Ownership

- Owns routing, `layout.tsx`, page composition, `globals.css`, `sitemap.ts`, and the legal pages.
- Does not own component internals. See `../components/AGENTS.md`.

## Local Contracts

### Metadata is owned by `layout.tsx`

`app/layout.tsx` is the single source for the document head: `metadataBase`, the `%s | SecPassGen Pro` title template, OpenGraph and Twitter cards, robots directives, icon set, manifest link, and the JSON-LD `WebApplication` block injected into `<head>`.

- `APP_DESCRIPTION` is a published product claim. Changing generation, storage, or network behaviour means changing it in the same commit.
- Page-level `metadata` exports must not contradict the layout defaults.

### The production hostname is hardcoded in four places

`app/layout.tsx`, `app/sitemap.ts`, `app/privacy/page.tsx`, `app/terms/page.tsx`, and `public/robots.txt` each embed `https://passwords.sdad.pro` directly rather than reading `NEXT_PUBLIC_APP_URL`. Change all of them together or search results and sitemap will disagree.

### Home page layout

- `app/page.tsx` is a `'use client'` component that locks the viewport with `h-screen overflow-hidden`. Content that needs to scroll will not scroll. This is deliberate, not a bug.
- Theme is local `useState` in `app/page.tsx`, passed to children as `isDarkMode`. It is not persisted, so a reload always returns to dark.
- `next-themes` is mounted nowhere, but `components/ui/sonner.tsx` calls `useTheme()`. Without a provider that always resolves to the `"system"` default, so toasts do not follow the in-app toggle. Either mount a `ThemeProvider` or drop the callout.

### Global styles

- `app/globals.css` is the only stylesheet the layout imports and is the source of truth for CSS variables and utilities.
- `styles/globals.css` is a dead duplicate. Nothing imports it. Delete it, or wire it in deliberately; do not treat it as authoritative.

## Work Guidance

- Monochrome system: pure `#000` / `#fff` surfaces, glass fills at `bg-white/5` / `bg-black/5`, borders at `border-white/10` / `border-black/10`.
- UI motion uses the cubic bezier `[0.16, 1, 0.3, 1]`.
- `Inter` is the only font, loaded once through `next/font/google` in the layout. Do not add a second font family.
- Accessibility metadata lives here, not in components.

## Verification

## Child DOX Index
