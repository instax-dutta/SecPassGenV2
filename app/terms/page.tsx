'use client'

import { useState } from 'react'
import Link from 'next/link'

const SECTIONS: { heading: string; body: React.ReactNode }[] = [
  {
    heading: 'What this service is',
    body: (
      <>
        SecPassGen is a free, single page tool that generates random passwords in your browser. It
        has no accounts, no paid tiers, no telemetry and no database. Using it requires no
        registration and no configuration.
      </>
    ),
  },
  {
    heading: 'What it is not',
    body: (
      <>
        It is not a password manager. It does not store, sync, autofill, or remember your passwords
        across devices. It does not audit existing passwords, detect breaches, or check whether a
        password has appeared in a leaked dataset. Those are different products that require
        handling your credentials, which is precisely what this one refuses to do.
      </>
    ),
  },
  {
    heading: 'No warranty',
    body: (
      <>
        The service is provided as is, without warranty of any kind, express or implied. While it
        is built on your browser&apos;s Web Crypto API and enforces a minimum entropy floor, we make
        no guarantee that a generated password will be accepted by any particular service, nor that
        it is suitable for any particular system. Availability is not promised.
      </>
    ),
  },
  {
    heading: 'Limitation of liability',
    body: (
      <>
        To the maximum extent permitted by law, the operators of this service are not liable for
        any loss or damage arising from use of it, including any loss of accounts, data, or revenue.
        Some jurisdictions do not allow certain exclusions, so parts of this section may not apply to
        you.
      </>
    ),
  },
  {
    heading: 'Acceptable use',
    body: (
      <>
        The service is offered for generating your own credentials. Do not use it to attack systems
        you do not own, to attempt bulk account creation, or to circumvent rate limits. Automated
        scraping of this site is not permitted.
      </>
    ),
  },
  {
    heading: 'Intellectual property',
    body: (
      <>
        SecPassGen is open source. The source code is published on GitHub under the licence stated in
        the repository. The name and marks belong to their respective owners.
      </>
    ),
  },
  {
    heading: 'Changes',
    body: (
      <>
        These terms may be updated as the service changes. Continued use after an update means you
        accept the revised terms.
      </>
    ),
  },
]

export default function TermsPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  const line = isDarkMode ? 'border-white/10' : 'border-black/10'
  const dim = isDarkMode ? 'text-white/60' : 'text-black/60'
  const body = isDarkMode ? 'text-white/85' : 'text-black/85'
  const bg = isDarkMode ? 'bg-black text-white' : 'bg-white text-black'

  return (
    <div className={`relative min-h-screen ${bg}`}>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(var(--track) / var(--grid)) 1px, transparent 1px),' +
            'linear-gradient(to bottom, rgb(var(--track) / var(--grid)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <main
        className="relative mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20"
        style={
          {
            '--track': isDarkMode ? '255 255 255' : '0 0 0',
            '--grid': isDarkMode ? '0.045' : '0.05',
            '--signal': isDarkMode ? '214 137 62' : '143 94 36',
          } as React.CSSProperties
        }
      >
        <Link
          href="/"
          className={`text-[10px] uppercase tracking-[0.16em] ${dim} transition-colors hover:text-white`}
        >
          &larr; SecPassGen
        </Link>

        <h1 className="mt-8 text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">Terms</h1>
        <p className={`mt-4 text-lg leading-relaxed ${dim}`}>
          The short version: use it to generate passwords, do not expect us to recover them, and
          understand that we provide it without warranty.
        </p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.heading}>
              <h2 className={`text-xl font-medium tracking-tight ${body}`}>{s.heading}</h2>
              <p className={`mt-3 text-[15px] leading-relaxed ${dim}`}>{s.body}</p>
            </section>
          ))}
        </div>

        <footer className={`mt-16 border-t ${line} pt-6`}>
          <div className="flex items-center justify-between">
            <Link href="/privacy" className={`text-[10px] uppercase tracking-[0.16em] ${dim} hover:text-white`}>
              Privacy
            </Link>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`text-[10px] uppercase tracking-[0.16em] ${dim} hover:text-white`}
            >
              {isDarkMode ? 'Light' : 'Dark'} theme
            </button>
          </div>
        </footer>
      </main>
    </div>
  )
}