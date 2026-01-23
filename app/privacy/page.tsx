'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, EyeOff, Key } from 'lucide-react'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-white p-6 sm:p-24 selection:bg-white selection:text-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto space-y-16"
            >
                <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-all hover:-translate-x-1">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                <header className="space-y-6">
                    <h1 className="text-5xl font-bold tracking-tighter">Privacy Policy</h1>
                    <p className="text-white/40 text-lg">Your data sovereignty is our mandate. Last updated: January 24, 2026</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                        {[
                            { icon: Shield, label: 'Zero Logs' },
                            { icon: Lock, label: 'Client-Side' },
                            { icon: EyeOff, label: 'Anonymous' },
                            { icon: Key, label: 'Encrypted' }
                        ].map((f, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
                                <f.icon className="h-5 w-5 text-white/60" />
                                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">{f.label}</span>
                            </div>
                        ))}
                    </div>
                </header>

                <section className="space-y-12 text-white/60 leading-relaxed text-lg">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Advanced Cryptographic Generation</h2>
                        <p>
                            SecPassGen Pro leverages high-entropy PRNG (Pseudo-Random Number Generation) to create <strong>cryptographically secure passwords</strong>.
                            Our generation algorithms utilize hardware-level entropy sources, ensuring that every <strong>unique password</strong> produced meets
                            enterprise security standards for <strong>AES-256 encryption</strong> compatibility and brute-force resistance.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Zero-Knowledge Architecture</h2>
                        <p>
                            Our <strong>secure password generator</strong> is built on a zero-knowledge framework. When you generate a <strong>strong random password</strong>,
                            the actual content of that password is never logged, cached, or stored on our servers in plain text. We solely store cryptographically
                            anonymized SHA-256 hashes to guarantee <strong>global password uniqueness</strong> without compromising individual user privacy.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Local-First Encrypted History</h2>
                        <p>
                            Your personal <strong>password history</strong> is protected by institutional-grade security. Data is stored within your browser's
                            Secure Context using the <strong>Web Crypto API</strong>. This history is encrypted with a device-specific key that never leaves your machine.
                            To further enhance your <strong>online security</strong>, all stored items automatically expire and are purged after 24 hours.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Anonymized Telemetry & SEO Integrity</h2>
                        <p>
                            We prioritize transparency. Our <strong>privacy-first approach</strong> means we utilize irreversibly hashed identifiers for
                            rate limiting and usage statistics. This ensures our <strong>online security tool</strong> remains fast and reliable for all users
                            while maintaining the highest standards of data protection and <strong>search engine visibility</strong>.
                        </p>
                    </div>
                </section>

                <footer className="pt-12 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/20 text-xs">
                    <span>&copy; 2026 SecPassGen Pro by SDAD.pro</span>
                    <Link href="https://sdad.pro" className="hover:text-white transition-colors">Main Domain: SDAD.pro</Link>
                </footer>
            </motion.div>
        </div>
    )
}
