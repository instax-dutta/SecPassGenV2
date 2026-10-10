'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Gavel, Scale, FileText, CheckCircle } from 'lucide-react'

export default function TermsOfService() {
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
                    <h1 className="text-5xl font-bold tracking-tighter">Terms of Service</h1>
                    <p className="text-white/40 text-lg">Operating guidelines for the world&apos;s most secure utility. Last updated: January 24, 2026</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                        {[
                            { icon: Gavel, label: 'Legal Binding' },
                            { icon: Scale, label: 'Fair Use' },
                            { icon: FileText, label: 'Audit Ready' },
                            { icon: CheckCircle, label: 'Compliance' }
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
                        <h2 className="text-2xl font-bold text-white tracking-tight">Provision of Security Services</h2>
                        <p>
                            SecPassGen Pro provides a <strong>free online password generator</strong> service designed for <strong>cybersecurity professionals</strong>
                            and privacy-conscious individuals. By accessing our <strong>secure password tool</strong>, you acknowledge that you are using
                            institutional-grade <strong>random password generation</strong> technology at your own discretion.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Responsible & Ethical Conduct</h2>
                        <p>
                            Users are strictly prohibited from using our <strong>unique password generation</strong> service for malicious activities,
                            including but not limited to automated brute-force attacks, credentials stuffing, or illegal system testing.
                            Our <strong>brute-force resistant technology</strong> is intended solely for defensive <strong>identity protection</strong>.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Limitation of Warranty</h2>
                        <p>
                            While we utilize <strong>cryptographically secure algorithms</strong> and local-first encryption, SDAD.pro provides this
                            utility on an &quot;as-is&quot; and &quot;as-available&quot; basis. We do not guarantee the perpetual availability of the service, nor are we
                            liable for any damages resulting from the loss or compromised state of <strong>generated passwords</strong> managed by the user.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Open Source & Transparency</h2>
                        <p>
                            We believe in the power of the community. As an <strong>open-source security project</strong>, we encourage users to
                            audit our source code on <strong>GitHub</strong> to verify our cryptographic implementations and <strong>privacy protections</strong>.
                            Our <strong>technical documentation</strong> is publicly available for peer review.
                        </p>
                    </div>
                </section>

                <footer className="pt-12 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/20 text-xs">
                    <span>&copy; 2026 SecPassGen Pro by SDAD.pro</span>
                    <Link href="https://sdad.pro" className="hover:text-white transition-colors">Enterprise Security: SDAD.pro</Link>
                </footer>
            </motion.div>
        </div>
    )
}
