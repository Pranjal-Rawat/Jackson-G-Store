// app/layout.jsx
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import Footer from '../components/Footer';
import PageTransitionLoader from '../components/PageTransitionLoader';
import Header from '../components/Header';
import FloatingCartButton from '../components/FloatingCartButton';

// ---- SEO Variables ----
const siteUrl = 'https://jackson-grocery.com';
const logo = 'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png';
const phone = '+91-XXXXXXXXXX'; // Update with actual
const address = {
  street: '123 Main Street',
  city: 'Dehradun',
  state: 'Uttarakhand',
  postalCode: '248001',
  country: 'IN',
};
const keywords =
  'Jackson Grocery Store, Grocery Store Dehradun, Best Grocery Store Dehradun, World of Groceries, Departmental Store Dehradun, Fresh groceries Dehradun, Grocery home delivery Dehradun, Buy groceries online Dehradun, Jackson groceries';

// ---- Metadata export for Next.js ----
export const metadata = {
  title: 'Jackson Grocery Store | Grocery Store Dehradun | Fresh Groceries Online',
  description:
    'Buy fresh groceries online in Dehradun from Jackson Grocery Store. Best quality fruits, vegetables, daily essentials, and more. Fast home delivery.',
  keywords,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Jackson Grocery Store | Grocery Store Dehradun',
    description:
      'Farm-fresh fruits, vegetables, and essentials delivered to your doorstep in Dehradun.',
    url: siteUrl,
    siteName: 'Jackson Grocery Store',
    images: [
      {
        url: logo,
        width: 1200,
        height: 630,
        alt: 'Jackson Grocery Store',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jackson_grocery',
    title: 'Jackson Grocery Store | Grocery Store Dehradun',
    description:
      'Buy fresh groceries online in Dehradun from Jackson Grocery Store. Best rates, best quality. Fast home delivery.',
    images: [logo],
  },
  // JSON-LD injected here
  other: {
    'ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'GroceryStore',
      name: 'Jackson Grocery Store',
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
      image: logo,
      sameAs: [
        siteUrl,
        // Add social profiles here if you have them
      ],
    }),
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
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          antialiased bg-white text-gray-900
          w-full min-w-0 overflow-x-hidden
        `}
        style={{ margin: 0, padding: 0 }}
      >
        <PageTransitionLoader />
        <Header />
        <main className="pt-[5.5rem] min-h-screen w-full bg-white">
          {children}
        </main>
        <FloatingCartButton />
        <Footer />
      </body>
    </html>
  );
}
