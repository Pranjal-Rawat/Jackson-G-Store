// app/layout.jsx
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import Footer from '@/components/Footer';
import PageTransitionLoader from '@/components/PageTransitionLoader';
import Header from '@/components/Header';
import FloatingCartButton from '@/components/FloatingCartButton';

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

export const metadata = {
  title: 'Jackson Grocery',
  description: 'Get fresh groceries delivered daily.',
  openGraph: {
    title: 'Jackson Grocery',
    description: 'Farm-fresh fruits, vegetables, and essentials.',
    url: 'https://yourdomain.com',
    siteName: 'Jackson Grocery',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg',
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
  },
};

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
        <PageTransitionLoader />      {/* 👈 ENABLED! */}
        <Header />
        {/* Only add top padding for the fixed header height */}
        <main className="pt-[5.5rem] min-h-screen w-full bg-white">
          {children}
        </main>
        <FloatingCartButton />
        <Footer />
      </body>
    </html>
  );
}
