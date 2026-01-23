# SecPassGen Pro 🔐

> **Enterprise-grade password generator** with guaranteed uniqueness, military-grade encryption, and seamless UX.

[![Open Source](https://img.shields.io/badge/Open%20Source-💚-success)](https://github.com/yourusername/SecPassGenV2)
[![AI Ready](https://img.shields.io/badge/AI%20Ready-🤖-blue)](/.agent)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-orange)](CONTRIBUTING.md)

🔗 **Live:** [passwords.sdad.pro](https://passwords.sdad.pro)  
🌐 **Powered by:** [SDAD.pro](https://sdad.pro)

---

## ✨ Features

- 🔐 **Cryptographically Secure** - Uses Web Crypto API
- ✨ **Guaranteed Unique** - Database-backed verification
- 🔒 **Encrypted History** - AES-256 local storage
- ⚡ **Buttery Smooth** - Lenis scroll + Framer Motion
- 🎨 **Monochrome Perfection** - Pure black/white theme
- 📱 **Fully Responsive** - Works everywhere
- 🤖 **AI-Ready** - Complete `.toon` documentation in `.agent/`

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/yourusername/SecPassGenV2.git
cd SecPassGenV2

# Install
npm install --legacy-peer-deps

# Setup DB (run schema.sql in NeonDB console)
# Add .env.local with DATABASE_URL

# Run
npm run dev
```

Visit `http://localhost:3000`

---

## 🗄️ Database Setup

1. Go to [console.neon.tech](https://console.neon.tech)
2. Open SQL Editor
3. Run `schema.sql`
4. Copy connection string to `.env.local`:

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAIN_DOMAIN=https://sdad.pro
```

---

## 🤖 AI-Ready Codebase

This project is **optimized for AI agents**. All architecture, patterns, and implementation details are documented in `.toon` format in the `.agent/` directory.

**For AI Agents:**
- Read `.agent/architecture.toon` for system overview
- Read `.agent/codebase.toon` for implementation details
- All docs use minimal tokens for maximum context

**For Humans:**
- Standard Next.js 14 app
- TypeScript + Tailwind
- Framer Motion + Lenis
- NeonDB PostgreSQL

---

## 🎨 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** NeonDB (PostgreSQL)
- **Styling:** Tailwind CSS
- **UI:** Radix UI + shadcn/ui
- **Animation:** Framer Motion + Lenis
- **Language:** TypeScript

---

## 🤝 Contributing

**We welcome vibe coders!** 🎉

This is an open-source project. Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit PRs
- 🎨 Improve design
- 📝 Fix typos

**No contribution is too small.**

### How to Contribute

1. Fork the repo
2. Create a branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Open a PR

---

## 📊 API Endpoints

### `POST /api/generate`
Generate unique passwords

```json
{
  "length": 16,
  "count": 1,
  "includeUppercase": true,
  "includeLowercase": true,
  "includeNumbers": true,
  "includeSymbols": true
}
```

### `GET /api/stats`
Get generation statistics

---

## 🔐 Security

- ✅ No plain text storage
- ✅ SHA-256 password hashing
- ✅ AES-256 history encryption
- ✅ IP hashing for privacy
- ✅ Rate limiting ready
- ✅ HTTPS enforced

---

## 📄 License

MIT - Use freely for personal or commercial projects.

---

## 🙏 Credits

Built with ❤️ by the community  
Powered by [SDAD.pro](https://sdad.pro)

---

**⭐ Star this repo if you find it useful!**
