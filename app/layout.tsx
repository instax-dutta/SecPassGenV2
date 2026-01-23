import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const APP_NAME = 'SecPassGen Pro';
const APP_DESCRIPTION = 'Generate cryptographically secure, unique passwords that are never repeated. Professional password generator with database-backed uniqueness verification.';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://passwords.sdad.pro';
const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'https://sdad.pro';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} - Secure Password Generator`,
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: `${APP_NAME} - Secure Password Generator`,
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME} - Generate Secure Passwords`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - Secure Password Generator`,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og-image.png`],
    creator: '@sdad_pro',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'google-site-verification-code', // Add your verification code
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: APP_NAME,
              description: APP_DESCRIPTION,
              url: APP_URL,
              applicationCategory: 'UtilityApplication',
              operatingSystem: 'Any',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              creator: {
                '@type': 'Organization',
                name: 'SDAD',
                url: MAIN_DOMAIN,
              },
              publisher: {
                '@type': 'Organization',
                name: 'SDAD',
                url: MAIN_DOMAIN,
              },
            }),
          }}
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
