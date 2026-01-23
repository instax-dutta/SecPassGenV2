'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-white p-8 sm:p-24 selection:bg-white selection:text-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto space-y-12"
            >
                <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                <header className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                    <p className="text-white/40">Last updated: January 24, 2026</p>
                </header>

                <section className="space-y-8 text-white/60 leading-relaxed">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Data Collection</h2>
                        <p>
                            SecPassGen Pro is designed with privacy as the core principle. We do not collect, store, or share your generated passwords.
                            The generation process happens entirely on our secure servers using cryptographically strong randomizers.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Local Storage</h2>
                        <p>
                            Your password history is encrypted using your device's unique signature and stored locally in your browser.
                            This data never leaves your device and automatically expires after 24 hours.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Usage Statistics</h2>
                        <p>
                            We maintain a global counter of generated passwords and anonymized hashes to ensure password uniqueness across the entire system.
                            We do not store IP addresses in plain text; all network identifiers are irreversibly hashed.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Third Parties</h2>
                        <p>
                            We do not use third-party tracking scripts or analytics. Your visit is private.
                        </p>
                    </div>
                </section>

                <footer className="pt-12 border-t border-white/10 text-white/20 text-sm">
                    SecPassGen Pro by SDAD.pro
                </footer>
            </motion.div>
        </div>
    )
}
