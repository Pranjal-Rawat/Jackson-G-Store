'use client';

// Route: /components/AddToCartButton.jsx – Button to add product to cart

import React from 'react';
import { useCartStore } from '@/stores/cartStore';

export default function AddToCartButton({
  product,
  quantity = 1,
  option = null,
  className = '',
  disabled = false,
}) {
  const addToCart = useCartStore((state) => state.addItem);

  // Use React.useCallback for stable reference (optimization if in large lists)
  const handleAddToCart = React.useCallback(
    (e) => {
      if (disabled) return;
      e.stopPropagation();
      addToCart({ ...product, quantity, option });
    },
    [disabled, addToCart, product, quantity, option]
  );

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center gap-1
        px-3 py-2 sm:px-4 sm:py-2.5
        bg-gradient-to-tr from-[#ed3237] via-[#ff5d38] to-[#ffcc29]
        hover:from-[#ffcc29] hover:via-[#ed3237] hover:to-[#ffcc29]
        text-white font-bold rounded-full shadow-md
        shadow-[#ed323760]/20 hover:shadow-[#ffcc2940]/40
        transition-all duration-200
        group overflow-hidden text-sm sm:text-base
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcc29]/70
        active:scale-97 hover:scale-102
        select-none
        backdrop-blur-sm
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
      aria-label={`Add ${product?.title || 'product'} to cart`}
      tabIndex={disabled ? -1 : 0}
      type="button"
    >
      <span className="absolute inset-0 z-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/20 transition-all duration-200 rounded-full pointer-events-none backdrop-blur-sm" />
      <span className="relative z-10 flex items-center justify-center">
        <span className="bg-[#ffcc29]/90 p-1 rounded-full mr-1 sm:mr-2 flex items-center justify-center shadow-inner shadow-[#ed3237]/10">
          <CartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#ed3237]" />
        </span>
        <span className="font-semibold tracking-wide drop-shadow-sm">
          <span className="block sm:hidden">{disabled ? 'Out of Stock' : 'Add'}</span>
          <span className="hidden sm:inline">{disabled ? 'Out of Stock' : 'Add to Cart'}</span>
        </span>
      </span>
    </button>
  );
}

// SVG Cart Icon – Jackson Theme Color
function CartIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="7" cy="16" r="1.5" fill="#ed3237" />
      <circle cx="15" cy="16" r="1.5" fill="#ed3237" />
      <path
        d="M2.5 3.5h2l2.28 9.12a1.25 1.25 0 0 0 1.21.88h6.5a1.25 1.25 0 0 0 1.21-.88l1.38-4.36a.75.75 0 0 0-.72-.98H7"
        stroke="#ed3237"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
