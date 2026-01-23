'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import PasswordGenerator from '../components/PasswordGenerator'
import PasswordHistory from '../components/PasswordHistory'
import AnimatedBackground from '../components/AnimatedBackground'
import { Switch } from "@/components/ui/switch"
import { Moon, Sun, ExternalLink, Github, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  const bgClass = isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
  const borderClass = isDarkMode ? 'border-white/5' : 'border-black/5'

  return (
    <div className={`h-screen overflow-hidden flex flex-col transition-colors duration-700 ${bgClass}`}>
      <AnimatedBackground isDarkMode={isDarkMode} />

      {/* Compact Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-20 w-full border-b transition-colors duration-700 ${borderClass} backdrop-blur-xl`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-7 h-7 sm:w-8 sm:h-8"
            >
              <Image
                src="/logo.png"
                alt="SecPassGen Pro"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            <h1 className={`text-sm sm:text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
              SecPassGen Pro
            </h1>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="https://github.com/instax-dutta/SecPassGenV2" target="_blank" rel="noopener noreferrer">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
              >
                <Github className="h-4 w-4" />
              </motion.div>
            </Link>
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all duration-700 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
              <Sun className={`h-3 w-3 transition-colors ${isDarkMode ? 'text-white/30' : 'text-black'}`} />
              <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              <Moon className={`h-3 w-3 transition-colors ${isDarkMode ? 'text-white' : 'text-black/30'}`} />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Force fit in viewport */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-4 overflow-hidden">
        <div className="w-full max-w-6xl h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-center">
            {/* Main Generator Section */}
            <div className="lg:col-span-2 space-y-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-1"
              >
                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  Enterprise-Grade Security
                </h2>
                <p className={`text-xs sm:text-sm max-w-xl ${isDarkMode ? 'text-white/50' : 'text-black/50'}`}>
                  Generate cryptographically secure passwords. Zero logs, maximum privacy.
                </p>
              </motion.div>

              <div className="scale-95 sm:scale-100 origin-top">
                <PasswordGenerator isDarkMode={isDarkMode} />
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-3 gap-2 sm:gap-4"
              >
                {[
                  { icon: '🔐', label: 'AES-256', desc: 'Local History' },
                  { icon: '⚡', label: 'Secure', desc: 'PRNG Based' },
                  { icon: '🛡️', label: 'Unique', desc: 'DB Verified' }
                ].map((f, i) => (
                  <div key={f.label} className={`p-2 sm:p-3 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                    <div className="text-sm font-semibold mb-0.5">{f.label}</div>
                    <div className="text-[10px] opacity-40">{f.desc}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* History Sidebar */}
            <div className="lg:col-span-1 hidden lg:block h-[450px]">
              <PasswordHistory isDarkMode={isDarkMode} />
            </div>
          </div>
        </div>
      </main>

      {/* Modern Footer with Global Stats */}
      <motion.footer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className={`relative z-20 w-full border-t transition-colors duration-700 ${borderClass} backdrop-blur-xl`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6 text-[10px] uppercase tracking-widest font-bold">
              <Link href="/privacy" className={`${isDarkMode ? 'text-white/30 hover:text-white' : 'text-black/30 hover:text-black'} transition-colors`}>Privacy</Link>
              <Link href="/terms" className={`${isDarkMode ? 'text-white/30 hover:text-white' : 'text-black/30 hover:text-black'} transition-colors`}>Terms</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="https://sdad.pro" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
              <span className={`text-[10px] ${isDarkMode ? 'text-white/30' : 'text-black/30'}`}>POWERED BY</span>
              <span className={`text-xs font-bold transition-colors ${isDarkMode ? 'text-white group-hover:text-white/80' : 'text-black group-hover:text-black/80'}`}>
                SDAD.pro
              </span>
            </Link>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
