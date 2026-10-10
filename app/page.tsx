'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PasswordGenerator from '../components/PasswordGenerator'
import PasswordHistory from '../components/PasswordHistory'
import AssuranceStrip from '../components/AssuranceStrip'
import { Moon, Sun, Github } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  const bgClass = isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
  const borderClass = isDarkMode ? 'border-white/[0.07]' : 'border-black/[0.07]'

  // app/layout.tsx pins class="dark" on <html> for the shadcn primitives, so
  // the dark value of --track would otherwise win in both themes and every
  // meter segment and rule would stay light-on-light. Re-binding it here from
  // the actual toggle is what makes light mode legible.
  //
  // --signal also splits by theme: the brass used on black measures 7.5:1, but
  // the same value on white is 2.8:1, which fails even for large text. Light
  // mode needs a darker brass of the same hue family.
  const themeVars = {
    '--track': isDarkMode ? '255 255 255' : '0 0 0',
    '--grid': isDarkMode ? '0.045' : '0.05',
    '--signal': isDarkMode ? '214 137 62' : '143 94 36',
  } as React.CSSProperties

  return (
    <div className={`relative flex min-h-screen flex-col ${bgClass} lg:h-screen lg:overflow-hidden`} style={themeVars}>
      {/* Graticule: a surface to read the instrument against, replacing the
          drifting particle field. Decoration that earned nothing here. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(var(--track) / var(--grid)) 1px, transparent 1px),' +
            'linear-gradient(to bottom, rgb(var(--track) / var(--grid)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          backgroundPosition: 'center center',
        }}
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true"
        style={{
          background: isDarkMode
            ? 'radial-gradient(ellipse 82% 62% at 50% 44%, transparent 0%, rgba(0,0,0,0.5) 68%, rgba(0,0,0,0.82) 100%)'
            : 'radial-gradient(ellipse 82% 62% at 50% 44%, transparent 0%, rgba(255,255,255,0.55) 68%, rgba(255,255,255,0.88) 100%)',
        }}
      />

      <motion.header
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-20 w-full border-b backdrop-blur-xl ${borderClass}`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">
          <Link href="/" prefetch={false} className="flex items-center gap-2.5">
            <span className="relative h-6 w-6 sm:h-7 sm:w-7">
              <Image src="/logo.png" alt="" fill className="object-contain" priority />
            </span>
            <span className={`text-[13px] font-medium tracking-tight ${isDarkMode ? 'text-white/85' : 'text-black/85'}`}>
              SecPassGen
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="https://github.com/instax-dutta/SecPassGenV2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Source on GitHub"
              className={`transition-opacity ${isDarkMode ? 'text-white/60 hover:text-white/90' : 'text-black/60 hover:text-black/90'}`}
            >
              <Github className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              className={`rounded-full border p-1.5 transition-colors duration-300 ${
                isDarkMode
                  ? 'border-white/10 text-white/70 hover:border-white/25 hover:text-white'
                  : 'border-black/10 text-black/70 hover:border-black/25 hover:text-black'
              }`}
            >
              {isDarkMode ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-4 py-5 sm:px-6">
        <div className="grid w-full max-w-5xl grid-cols-1 gap-4 lg:grid-cols-[1fr_300px] lg:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <PasswordGenerator isDarkMode={isDarkMode} />
            <div className="mt-3">
              <AssuranceStrip isDarkMode={isDarkMode} />
            </div>
          </motion.div>

          <div className="lg:h-full">
            <PasswordHistory isDarkMode={isDarkMode} />
          </div>
        </div>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className={`relative z-20 w-full border-t backdrop-blur-xl ${borderClass}`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <nav className="flex items-center gap-5">
            {[
              { href: '/privacy', label: 'Privacy' },
              { href: '/terms', label: 'Terms' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={`text-[10px] uppercase tracking-[0.16em] transition-colors ${
                  isDarkMode ? 'text-white/60 hover:text-white/90' : 'text-black/60 hover:text-black/90'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="https://sdad.pro"
            target="_blank"
            rel="noopener noreferrer"
            prefetch={false}
            className={`text-[10px] uppercase tracking-[0.16em] transition-colors ${
              isDarkMode ? 'text-white/60 hover:text-white/85' : 'text-black/60 hover:text-black/85'
            }`}
          >
            SDAD.pro
          </Link>
        </div>
      </motion.footer>
    </div>
  )
}