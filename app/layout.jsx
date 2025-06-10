import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import Footer from '@/components/Footer';

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
    url: 'https://yourdomain.com', // ✅ Replace this with your real domain
    siteName: 'Jackson Grocery',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg', // ✅ Replace this with actual OG image
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
    site: '@jackson_grocery', // ✅ Replace this if Twitter is integrated
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
