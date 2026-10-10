'use client'

import { useState } from 'react'
import Link from 'next/link'

interface QA {
  q: string
  a: React.ReactNode
}

const QA_BLOCKS: { question: string; answer: string }[] = [
  {
    question: 'Does SecPassGen store my passwords?',
    answer:
      'No. Passwords are created by your own browser using the Web Crypto API and are never transmitted to us. We operate no database, so there is no record of any password to disclose, sell, or lose.',
  },
  {
    question: 'Can you recover a password for me?',
    answer:
      'No, and that is deliberate. Because we never receive the password, we hold nothing that could be returned. A service that could recover your password is a service that had your password.',
  },
  {
    question: 'Does the page send anything to your server?',
    answer:
      'Once the page has loaded, it makes no network requests at all. The page displays a live count of data requests measured by your own browser, and it reads zero. If that number were ever anything else, the claim would visibly stop being true.',
  },
  {
    question: 'What is the entropy floor?',
    answer:
      'Every password is held to a minimum of 60 bits of entropy, measured as length times log2 of the alphabet size. A password below that is refused rather than served. At or above it, the chance of a repeat is small enough to be unobservable, which is why no stored list of issued passwords is needed.',
  },
  {
    question: 'What is the Recent panel?',
    answer:
      'A short history kept only in your browser, encrypted with AES-GCM, holding at most 10 entries and expiring after 24 hours. It is never uploaded. Clearing your browser data removes it.',
  },
  {
    question: 'Do you use analytics or tracking?',
    answer:
      'None. There is no analytics script, no tracking pixel, no cookie, and no third-party request of any kind on this site.',
  },
]

const NOT_STORED: [string, string][] = [
  ['Passwords', 'Never transmitted, never persisted anywhere'],
  ['Generated history', 'Browser only, encrypted, 24 hour expiry'],
  ['Accounts', 'None exist. There is nothing to sign up for'],
  ['Usage analytics', 'Not collected in any form'],
  ['Cookies', 'None set by this site'],
  ['Advertising identifiers', 'Not used'],
]

export default function PrivacyPage() {
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: QA_BLOCKS.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
          }),
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

        <h1 className="mt-8 text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">Privacy</h1>
        <p className={`mt-4 text-lg leading-relaxed ${dim}`}>
          SecPassGen has nothing to disclose, because it keeps nothing. This page states exactly
          what that means, including the parts that are less flattering.
        </p>

        <section className={`mt-10 rounded-xl border ${line} ${isDarkMode ? 'bg-white/[0.02]' : 'bg-black/[0.01]'}`}>
          <h2 className="px-5 pt-5 text-[10px] uppercase tracking-[0.16em] text-[rgb(var(--signal))]">
            In short
          </h2>
          <p className={`px-5 pb-5 pt-3 text-[15px] leading-relaxed ${body}`}>
            Passwords are generated on your device and never leave it. There is no database, no
            account, no analytics, and no cookie. After the page loads it makes zero network
            requests, and the page shows you that count live.
          </p>
        </section>

        <h2 className={`mt-14 text-2xl font-medium tracking-tight ${body}`}>What is not stored</h2>
        <div className={`mt-4 overflow-hidden rounded-xl border ${line}`}>
          <dl>
            {NOT_STORED.map(([k, v], i) => (
              <div
                key={k}
                className={`px-5 py-3.5 ${i > 0 ? `border-t ${line}` : ''}`}
              >
                <dt className={`text-[13px] font-medium ${body}`}>{k}</dt>
                <dd className={`mt-0.5 text-[13px] ${dim}`}>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <h2 className={`mt-14 text-2xl font-medium tracking-tight ${body}`}>Common questions</h2>
        <div className="mt-4 space-y-2.5">
          {QA_BLOCKS.map((item) => (
            <details key={item.question} className={`group rounded-xl border ${line} px-5 py-4`}>
              <summary
                className={`cursor-pointer list-none text-[15px] font-medium marker:hidden ${body}`}
              >
                <span className="mr-2 text-[rgb(var(--signal))]">+</span>
                {item.question}
              </summary>
              <p className={`mt-3 text-[14px] leading-relaxed ${dim}`}>{item.answer}</p>
            </details>
          ))}
        </div>

        <h2 className={`mt-14 text-2xl font-medium tracking-tight ${body}`}>
          The parts worth being honest about
        </h2>

        <div className="mt-4 space-y-5">
          <div className={`rounded-xl border ${line} p-5`}>
            <h3 className={`text-[15px] font-medium ${body}`}>Your host still sees the request</h3>
            <p className={`mt-2 ${dim}`}>
              This site is served by Vercel. Like any web host, Vercel may process standard
              request metadata such as IP address and user agent in order to deliver files. That is
              infrastructure, not product analytics, and we cannot switch it off from here. It
              matters only in one respect, and that respect is favourable: the traffic contains no
              password, because no password is ever sent.
            </p>
          </div>

          <div className={`rounded-xl border ${line} p-5`}>
            <h3 className={`text-[15px] font-medium ${body}`}>
              Local history is obfuscated, not vaulted
            </h3>
            <p className={`mt-2 ${dim}`}>
              The Recent panel is encrypted with AES-GCM, but the key is derived from a coarse
              device fingerprint such as browser language and screen size. That is enough to stop
              casual inspection of browser storage. It is not protection against someone who
              already has your machine. We would rather say this plainly than let the word
              &quot;encrypted&quot; imply more than it delivers here.
            </p>
          </div>

          <div className={`rounded-xl border ${line} p-5`}>
            <h3 className={`text-[15px] font-medium ${body}`}>Your clipboard is yours</h3>
            <p className={`mt-2 ${dim}`}>
              Copying puts the password on your system clipboard, where other software may be able
              to read it. We cannot control that, and it is the main practical way a generated
              password can leak. Paste it into a password manager and clear your clipboard when you
              are done.
            </p>
          </div>
        </div>

        <h2 className={`mt-14 text-2xl font-medium tracking-tight ${body}`}>Changes</h2>
        <p className={`mt-3 text-[14px] leading-relaxed ${dim}`}>
          This policy describes the service as it actually behaves. If the behaviour ever changes,
          this page changes with it, in the same commit.
        </p>

        <footer className={`mt-16 border-t ${line} pt-6`}>
          <div className="flex items-center justify-between">
            <Link href="/terms" className={`text-[10px] uppercase tracking-[0.16em] ${dim} hover:text-white`}>
              Terms
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