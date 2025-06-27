export const metadata = {
  title: 'Your Cart | Jackson Grocery Store | Grocery Store Dehradun',
  description:
    'View and manage your cart at Jackson Grocery Store. Fast grocery delivery in Dehradun. Checkout your groceries, fruits, vegetables, snacks, and essentials.',
  keywords:
    'Cart, Grocery Cart, Jackson Grocery Store, Buy groceries online, Grocery Store Dehradun, Online grocery cart, Best grocery store in Dehradun',
  alternates: {
    canonical: 'https://jackson-grocery.com/cart',
  },
  openGraph: {
    title: 'Your Cart | Jackson Grocery Store',
    description:
      'Review your groceries in your cart before fast checkout. Fresh groceries delivered daily in Dehradun.',
    url: 'https://jackson-grocery.com/cart',
    siteName: 'Jackson Grocery Store',
    images: [
      {
        url: 'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png',
        width: 1200,
        height: 630,
        alt: 'Jackson Grocery Store Cart',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Cart | Jackson Grocery Store',
    description:
      'Easily manage and checkout your groceries at Jackson Grocery Store, Dehradun.',
    images: [
      'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png',
    ],
  },
};

import BusinessInfo from '../../components/BusinessInfo';
import Cart from '../../components/Cart';
import Image from 'next/image';

export default function CartPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fff9f0] via-[#f5fbfa] to-[#fff6e3] pb-20">
      {/* Cart Contents */}
      <Cart />

      {/* Store Info Card */}
      <section className="flex justify-center" aria-label="Store Info">
        <div
          className="
            mt-16 mb-8 max-w-xl w-full
            bg-white/90 backdrop-blur-xl border border-[#ffcc29]/50
            rounded-3xl shadow-lg px-7 py-7
            flex flex-col items-center
            transition hover:shadow-2xl
          "
        >
          <div className="flex items-center gap-3 mb-2">
            <Image
              src="https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png"
              alt="Jackson Grocery Store logo"
              className="w-11 h-11 rounded-full shadow"
              width={44}
              height={44}
              priority={false}
            />
            <span className="font-extrabold text-xl text-[#ed3237] tracking-tight">
              Jackson Grocery Store
            </span>
          </div>
          <BusinessInfo />
        </div>
      </section>
    </main>
  );
}
