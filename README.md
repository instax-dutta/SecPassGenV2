# SecPassGen Pro 🔐

> **Institutional-grade password security** with guaranteed uniqueness, client-side encryption, and a polished monochrome aesthetic.

[![Open Source](https://img.shields.io/badge/Open%20Source-🖤-success)](https://github.com/instax-dutta/SecPassGenV2)
[![AI Ready](https://img.shields.io/badge/AI%20Ready-🤖-blue)](/.agent)
[![Live Demo](https://img.shields.io/badge/Live-Demo-lightgrey)](https://passwords.sdad.pro)

🔗 **App URL:** [passwords.sdad.pro](https://passwords.sdad.pro)  
🌐 **Main Domain:** [SDAD.pro](https://sdad.pro)

---

## ✨ Features

- 🔐 **Cryptographically Secure** - High-entropy generation via Web Crypto API (PRNG).
- 🛡️ **Guaranteed Unique** - A 60-bit entropy floor makes a repeat unobservable, with a keyed HMAC cross-check.
- 🔒 **AES-256 Local History** - Encrypted locally in your browser; auto-expires in 24h.
- ⚡ **No Database Round-Trip** - Uniqueness is established arithmetically; recording is a single atomic write.
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

2. **Secrets**
   - Generate the signature secret: `openssl rand -base64 48`

3. **Database Setup (NeonDB)**
   - Run `schema.sql` in your [NeonDB Console](https://console.neon.tech).
   - Create `.env.local` using `.env.example`.
   ```env
   DATABASE_URL=your_postgresql_url
   UNIQUENESS_SECRET=your_generated_secret
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_MAIN_DOMAIN=https://sdad.pro
   ```

   `UNIQUENESS_SECRET` is required. The app refuses to record passwords without it rather than
   falling back to a default, because a known default would make every stored signature
   reproducible by anyone holding the database.

3. **Launch**
   ```bash
   npm run dev
   ```

---

## 🏗️ Architecture (Agent-Ready)

System documentation lives in a hierarchical `AGENTS.md` tree. Read the root `AGENTS.md` first; each folder that owns a durable concern has its own contract next to the code it describes.

```
AGENTS.md           - Project facts, product invariants, repo-wide workflow
├── app/            - Layout, metadata, JSON-LD, sitemap, global CSS
│   └── api/        - Generation and stats endpoints, uniqueness contracts
├── components/     - First-party UI
│   └── ui/         - Vendored shadcn/Radix primitives
├── hooks/          - Shared React hooks
├── lib/            - Database access and encrypted browser storage
└── public/         - Static assets, robots.txt, PWA manifest
```

---

## 🎨 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** NeonDB (PostgreSQL)
- **Animations:** Framer Motion + Lenis (Smooth Scroll)
- **Styling:** Tailwind CSS + Radix UI
- **Security:** Web Crypto API + Subkey Encryption
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

- **Zero-Logging**: Passwords never touch our servers in plain text.
- **Keyed Signatures**: Passwords are recorded only as an HMAC-SHA-256 under a server-held secret, so a stolen database cannot be cracked.
- **Resilience**: API handles database latency with automatic local fallback.
- **Speed**: Optimized bundle size with Next.js image and CSS optimization.

---

## 📄 License

MIT - Developed by the community for a secure web.  
Powered by [SDAD.pro](https://sdad.pro)

---

**⭐ Star this repo if you find it useful!**
