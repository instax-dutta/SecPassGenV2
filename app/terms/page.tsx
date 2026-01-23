'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
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
                    <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                    <p className="text-white/40">Last updated: January 24, 2026</p>
                </header>

                <section className="space-y-8 text-white/60 leading-relaxed">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Acceptance of Terms</h2>
                        <p>
                            By using SecPassGen Pro, you agree to be bound by these terms. This is a security utility provided "as is" without warranties of any kind.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Ethical Use</h2>
                        <p>
                            This tool is intended for personal and professional security enhancement. Any use for illegal activities or system abuse is strictly prohibited.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Liability</h2>
                        <p>
                            While we use industry-standard cryptographic methods, you are responsible for the management and security of your own passwords.
                            SDAD.pro is not liable for any security breaches resulting from the use or misuse of generated content.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">Open Source</h2>
                        <p>
                            This project is open-source. You are encouraged to audit the code on GitHub for your own security verification.
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
