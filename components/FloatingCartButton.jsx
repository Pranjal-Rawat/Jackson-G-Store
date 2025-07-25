'use client';

// Route: /components/FloatingCartButton.jsx – Floating button for cart quick access

import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { useCartStore } from '../stores/cartStore';
import { usePathname } from 'next/navigation';

export default function FloatingCartButton() {
  const cartCount = useCartStore((state) => state.count);
  const pathname = usePathname();

  // Don't render on Cart page
  if (pathname === '/cart') return null;

  // Bounce only if cart has items
  const bounce = cartCount > 0 ? 'animate-bounce' : '';

  return (
    <Link
      href="/cart"
      className={`fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-3 text-lg font-semibold transition-all duration-200 ring-2 ring-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-400 ${bounce}`}
      aria-label={`Open Cart${cartCount > 0 ? ` with ${cartCount} item${cartCount > 1 ? 's' : ''}` : ''}`}
      tabIndex={0}
    >
      <FiShoppingCart className="h-6 w-6" aria-hidden="true" />
      <span className="hidden sm:inline">View Cart</span>
      {cartCount > 0 && (
        <span
          className="ml-2 bg-white text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-base font-bold shadow"
          aria-label={`${cartCount} item${cartCount === 1 ? '' : 's'} in cart`}
        >
          {cartCount}
        </span>
      )}
      <span className="sr-only">
        {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''} in cart` : 'Cart is empty'}
      </span>
    </Link>
  );
}
