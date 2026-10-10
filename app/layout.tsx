import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

const APP_NAME = 'SecPassGen';
const APP_DESCRIPTION = 'Free browser-only password generator. Passwords are created on your device with the Web Crypto API and are never transmitted or stored. Every password is held to a 60-bit entropy floor, so no repeat is ever served.';
const APP_URL = 'https://passwords.sdad.pro';
const MAIN_DOMAIN = 'https://sdad.pro';

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  authors: [{ name: 'SDAD', url: MAIN_DOMAIN }],
  generator: 'Next.js',
  keywords: [
    'password generator',
    'secure password',
    'random password',
    'strong password',
    'unique password',
    'cryptographic password',
    'password security',
    'online password generator',
    'free password tool',
    'sdad.pro'
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'SDAD',
  publisher: 'SDAD',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: `${APP_NAME} - Secure Password Generator`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Professional Secure Password Generator`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - Secure Password Generator`,
    description: APP_DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@sdad_pro',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  category: 'security',
  other: {
    'og:logo': 'https://passwords.sdad.pro/icon-512.png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebApplication',
                  '@id': `${APP_URL}/#app`,
                  name: APP_NAME,
                  description: APP_DESCRIPTION,
                  url: APP_URL,
                  applicationCategory: 'SecurityApplication',
                  applicationSubCategory: 'Password Generator',
                  operatingSystem: 'Any',
                  browserRequirements: 'Requires a browser with crypto.getRandomValues',
                  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                  featureList: [
                    'Runs entirely in the browser',
                    'No server, no database, no account',
                    '60-bit minimum entropy floor',
                    'Zero network requests after page load',
                    'No analytics, cookies, or tracking',
                  ],
                  creator: { '@type': 'Organization', name: 'SDAD', url: MAIN_DOMAIN },
                  publisher: { '@type': 'Organization', name: 'SDAD', url: MAIN_DOMAIN },
                },
                {
                  '@type': 'WebSite',
                  '@id': `${APP_URL}/#website`,
                  url: APP_URL,
                  name: APP_NAME,
                  description: APP_DESCRIPTION,
                  publisher: { '@id': `${APP_URL}/#app` },
                  inLanguage: 'en',
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
