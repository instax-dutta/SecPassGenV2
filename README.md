# SecPassGen

> **Institutional-grade password security** with guaranteed uniqueness, client-side encryption, and a polished monochrome aesthetic.

[![Open Source](https://img.shields.io/badge/Open%20Source-🖤-success)](https://github.com/instax-dutta/SecPassGenV2)
[![AI Ready](https://img.shields.io/badge/AI%20Ready-🤖-blue)](/.agent)
[![Live Demo](https://img.shields.io/badge/Live-Demo-lightgrey)](https://passwords.sdad.pro)

🔗 **App URL:** [passwords.sdad.pro](https://passwords.sdad.pro)  
🌐 **Main Domain:** [SDAD.pro](https://sdad.pro)

---

## ✨ Features

- 🔐 **Cryptographically Secure** - High-entropy generation via Web Crypto API (PRNG).
- 🛡️ **Guaranteed Unique** - A 60-bit entropy floor makes a repeat mathematically unobservable.
- 🔒 **AES-256 Local History** - Encrypted locally in your browser; auto-expires in 24h.
- ⚡ **Zero Backend** - Generation runs in your browser. No API call, no database, no serverless function.
- 🎨 **Monochrome Aesthetic** - Sophisticated black/white design with premium animations.
- 🤖 **Agent-Ready** - Self-documenting `AGENTS.md` hierarchy that agents and contributors can navigate.
- 📱 **Viewport Perfect** - Compact layout designed to fit perfectly in a single viewport.
- 🔍 **SEO & AI Ready** - Built-in sitemap, robots.txt, and AI agent crawler support.

---

## 🚀 Quick Start

### Local Development

1. **Clone & Install**
   ```bash
   git clone https://github.com/instax-dutta/SecPassGenV2.git
   cd SecPassGenV2
   npm install --legacy-peer-deps
   ```

2. **Launch**
   ```bash
   npm run dev
   ```

   No database, no secrets, no configuration. The app runs with an empty environment.

---

## 🏗️ Architecture (Agent-Ready)

System documentation lives in a hierarchical `AGENTS.md` tree. Read the root `AGENTS.md` first; each folder that owns a durable concern has its own contract next to the code it describes.

```
AGENTS.md           - Project facts, product invariants, repo-wide workflow
├── app/            - Layout, metadata, JSON-LD, sitemap, global CSS, legal pages
├── components/     - First-party UI
│   └── ui/         - Vendored shadcn/Radix primitives
├── hooks/          - Shared React hooks
├── lib/            - Entropy, character selection, session dedup, encrypted storage
├── scripts/        - Verification gates for every guarantee above
└── public/         - Static assets, robots.txt, PWA manifest
```

---

## 🎨 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS + Radix UI
- **Security:** Web Crypto API (CSPRNG) + AES-GCM local history
- **SEO/Metadata:** Next.js Metadata API + JSON-LD

---

## 🤝 Contributing

We welcome professional contributions! Whether it's security audits, design refinements, or performance tweaks.

1. Fork the repository.
2. Create a feature branch.
3. Commit with concise messages.
4. Push and open a Pull Request.

---

## 📊 Performance & Privacy

- **Never Transmitted**: Passwords are generated in your browser and never sent to our servers at all.
- **Nothing Stored**: We operate no database and keep no record of any password.
- **Speed**: Optimized bundle size with Next.js image and CSS optimization.

---

## 📄 License

MIT - Developed by the community for a secure web.  
Powered by [SDAD.pro](https://sdad.pro)

---

**⭐ Star this repo if you find it useful!**
