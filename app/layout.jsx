// File: app/layout.jsx
import { Geist, Geist_Mono } from 'next/font/google'
import '../styles/globals.css'
import Script from 'next/script'
import { Providers } from './providers'

import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTransitionLoader from '../components/PageTransitionLoader'
import FloatingCartButton from '../components/FloatingCartButton'
import QuickLinks from '../components/QuickLinks'
import FloatingFestivalBanner from '../components/FloatingFestivalBanner' // 🎉 New Floating Circle Banner

const siteUrl  = 'https://jackson-grocery.com'
const siteName = 'Jackson Grocery Store'
const logo     = 'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png'
const phone    = '+91-9557520189'  // Updated Phone Number
const address  = {
  street:     '1 Municipal Road, Dalanwala',
  city:       'Dehradun',
  state:      'Uttarakhand',
  postalCode: '248001',
  country:    'IN',
}
const sameAs   = [siteUrl]

// 1️⃣ Metadata without themeColor
export const metadata = {
  title:       `${siteName} | Grocery Store Dehradun | Fresh Groceries Online`,
  description: 'Buy fresh groceries online in Dehradun from Jackson Grocery Store. Fast home delivery.',
  keywords:    'Jackson Grocery Store, Grocery Store Dehradun, Fresh groceries Dehradun, Grocery online Dehradun',
  metadataBase: new URL(siteUrl),
  alternates:  { canonical: siteUrl },
  openGraph: {
    title:       `${siteName} | Grocery Store Dehradun`,
    description: 'Farm-fresh fruits and essentials delivered to your doorstep in Dehradun.',
    url:         siteUrl,
    siteName,
    images:      [{ url: logo, width: 1200, height: 630, alt: siteName }],
    locale:      'en_IN',
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    site:        '@jackson_grocery',
    title:       `${siteName} | Grocery Store Dehradun`,
    description: 'Buy fresh groceries online in Dehradun from Jackson Grocery Store.',
    images:      [logo],
  },
  icons: {
    icon:     '/favicon.ico',
    shortcut: '/favicon.ico',
    apple:    '/favicon.png',
  },
}

// 2️⃣ New generateViewport export
export function generateViewport() {
  return {
    viewport: 'width=device-width, initial-scale=1',
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)',  color: '#000000' },
    ],
  }
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets:  ['latin'],
  display:  'swap',
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets:  ['latin'],
  display:  'swap',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-white w-full overflow-x-hidden`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="antialiased bg-white text-gray-900 min-w-0">
        <Providers>
          {/* JSON-LD for SEO */}
          <Script
            id="grocery-jsonld"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context':     'https://schema.org',
                '@type':        'GroceryStore',
                name:           siteName,
                image:          logo,
                url:            siteUrl,
                telephone:      phone,
                address: {
                  '@type':           'PostalAddress',
                  streetAddress:     address.street,
                  addressLocality:   address.city,
                  addressRegion:     address.state,
                  postalCode:        address.postalCode,
                  addressCountry:    address.country,
                },
                contactPoint: [
                  {
                    '@type':            'ContactPoint',
                    telephone:          phone,
                    contactType:        'customer service',
                    areaServed:         'IN',
                    availableLanguage: 'English',
                  },
                ],
                sameAs,
              }),
            }}
          />

          {/* Accessibility Skip Link */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 bg-white text-blue-600 px-4 py-2 rounded shadow"
          >
            Skip to main content
          </a>

          {/* Components */}
          <PageTransitionLoader />
          <Header />

          <main
            id="main-content"
            className="pt-[7.5rem] sm:pt-[8rem] min-h-screen w-full bg-white"
          >
            {children}
          </main>

          <QuickLinks />
          <FloatingCartButton />

          {/* Floating Festival Circle */}
          <FloatingFestivalBanner />

          <Footer />
        </Providers>
      </body>
    </html>
  )
}
