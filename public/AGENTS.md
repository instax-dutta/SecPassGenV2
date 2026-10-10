# public

## Purpose

Files served verbatim from the site root: static assets, crawler policy, and PWA metadata.

## Ownership

- Owns everything here as a deployment artefact. Nothing in this folder is compiled or transformed.
- Owns the crawler policy and the manifest. Both are published product surfaces, not build noise.
- The sitemap source lives in `app/sitemap.ts`, not here. Only the `robots.txt` reference to it lives here.

## Local Contracts

### `robots.txt` is deliberate

It explicitly allowlists GPTBot, ChatGPT-User, ClaudeBot, ClaudeWeb, PerplexityBot, CCBot, Google-Extended, and OAI-SearchBot, and declares the sitemap. This is a positioning decision, not leftover template text. Removing an entry is a product change that needs intent behind it, not a cleanup.

### `manifest.json` is a published claim

Its `description` and `name` appear to the user in an installed PWA. Keep it consistent with `app/layout.tsx` and `app/privacy/page.tsx`.

### Hardcoded hostname

`https://passwords.sdad.pro` appears in `robots.txt` here and in `app/layout.tsx`, `app/sitemap.ts`, `app/privacy/page.tsx`, and `app/terms/page.tsx`. None of them read an env var. Change all five together.

### Assets referenced by metadata must exist here

`favicon.ico`, `icon.svg`, `apple-icon.png`, `og-image.png`, and `logo.png` are all referenced from `app/layout.tsx`, `app/page.tsx`, or the manifest. Removing one breaks metadata or a page.

## Work Guidance

- `placeholder-logo.png`, `placeholder-logo.svg`, `placeholder-user.jpg`, `placeholder.jpg`, and `placeholder.svg` are unreferenced template leftovers. Safe to delete.
- `favicon.ico`, `apple-icon.png`, and `icon.svg` are the same 488 KB file under three names. Optimising them is a straightforward win and does not require code changes.

## Verification

## Child DOX Index
