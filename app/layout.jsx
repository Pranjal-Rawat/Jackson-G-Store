import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageTransitionLoader from '../components/PageTransitionLoader';
import FloatingCartButton from '../components/FloatingCartButton';

const siteUrl = 'https://jackson-grocery.com';
const siteName = 'Jackson Grocery Store';
const logo = 'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png';
const phone = '+91-7417229660';
const address = {
  street: '1 Municipal Road, Dalanwala',
  city: 'Dehradun',
  state: 'Uttarakhand',
  postalCode: '248001',
  country: 'IN',
};
const sameAs = [siteUrl];

export const metadata = {
  title: `${siteName} | Grocery Store Dehradun | Fresh Groceries Online`,
  description: 'Buy fresh groceries online in Dehradun from Jackson Grocery Store. Best quality fruits, vegetables, daily essentials, and more. Fast home delivery.',
  keywords:
    'Jackson Grocery Store, Grocery Store Dehradun, Best Grocery Store Dehradun, World of Groceries, Departmental Store Dehradun, Fresh groceries Dehradun, Grocery home delivery Dehradun, Buy groceries online Dehradun, Jackson groceries',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: `${siteName} | Grocery Store Dehradun`,
    description: 'Farm-fresh fruits, vegetables, and essentials delivered to your doorstep in Dehradun.',
    url: siteUrl,
    siteName,
    images: [
      {
        url: logo,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jackson_grocery',
    title: `${siteName} | Grocery Store Dehradun`,
    description: 'Buy fresh groceries online in Dehradun from Jackson Grocery Store. Best rates, best quality. Fast home delivery.',
    images: [logo],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-white w-full overflow-x-hidden">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 min-w-0`}>
        {/* JSON-LD SEO Schema */}
        <Script
          id="grocery-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'GroceryStore',
              name: siteName,
              image: logo,
              url: siteUrl,
              telephone: phone,
              address: {
                '@type': 'PostalAddress',
                streetAddress: address.street,
                addressLocality: address.city,
                addressRegion: address.state,
                postalCode: address.postalCode,
                addressCountry: address.country,
              },
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: phone,
                  contactType: 'customer service',
                  areaServed: 'IN',
                  availableLanguage: 'English',
                },
              ],
              sameAs,
            }),
          }}
        />

        <PageTransitionLoader />
        <Header />
        <main id="main-content" className="pt-[7.5rem] sm:pt-[8rem] min-h-screen w-full bg-white">
          {children}
        </main>
        <FloatingCartButton />
        <Footer />
      </body>
    </html>
  );
}
