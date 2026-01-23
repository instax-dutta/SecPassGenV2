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
- 🛡️ **Guaranteed Unique** - Cross-referenced against anonymized database hashes.
- 🔒 **AES-256 Local History** - Encrypted locally in your browser; auto-expires in 24h.
- ⚡ **Performance Optimized** - Batch generation with resilient database fallbacks.
- 🎨 **Monochrome Aesthetic** - Sophisticated black/white design with premium animations.
- 🤖 **AI-First Documentation** - Token-optimized `.toon` architecture for AI agents.
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

2. **Database Setup (NeonDB)**
   - Run `schema.sql` in your [NeonDB Console](https://console.neon.tech).
   - Create `.env.local` using `.env.example`.
   ```env
   DATABASE_URL=your_postgresql_url
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_MAIN_DOMAIN=https://sdad.pro
   ```

3. **Launch**
   ```bash
   npm run dev
   ```

---

## 🏗️ Architecture (AI-Ready)

This project is built for **human-AI collaboration**. All system specifications are located in the `.agent/` folder:
- `architecture.toon`: High-level system design and data flow.
- `codebase.toon`: Implementation patterns, core modules, and patterns.

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
- **Anonymization**: IP addresses and password signatures are irreversibly hashed.
- **Resilience**: API handles database latency with automatic local fallback.
- **Speed**: Optimized bundle size with Next.js image and CSS optimization.

---

## 📄 License

MIT - Developed by the community for a secure web.  
Powered by [SDAD.pro](https://sdad.pro)

---

**⭐ Star this repo if you find it useful!**
