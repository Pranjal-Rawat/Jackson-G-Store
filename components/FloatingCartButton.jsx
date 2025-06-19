// Route: /components/FloatingCartButton.jsx – Floating button for cart quick access

'use client';

import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { useCartStore } from '@/stores/cartStore';
import { usePathname } from 'next/navigation';

export default function FloatingCartButton() {
  const cartCount = useCartStore((state) => state.count);
  const pathname = usePathname();

  // Hide on cart page
  if (pathname === '/cart') return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-3 text-lg font-semibold transition-all duration-200 ring-2 ring-red-200 focus:outline-none focus:ring-4 focus:ring-red-400 animate-bounce"
      aria-label="View Cart"
      tabIndex={0}
      style={{ minWidth: 60 }}
    >
      <FiShoppingCart className="h-6 w-6" />
      <span className="hidden sm:inline">View Cart</span>
      {cartCount > 0 && (
        <span
          className="ml-2 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-base font-bold shadow"
          aria-label={`${cartCount} item${cartCount === 1 ? '' : 's'} in cart`}
        >
          {cartCount}
        </span>
      )}
    </Link>
  );
}
