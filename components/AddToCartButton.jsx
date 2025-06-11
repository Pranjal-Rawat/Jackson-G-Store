'use client';

import React from 'react';
import { useCartStore } from '@/stores/cartStore';

export default function AddToCartButton({
  product,
  quantity = 1,
  option = null,
  className = '',
}) {
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({ ...product, quantity, option });
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`
        relative flex items-center gap-2 px-6 py-3
        bg-gradient-to-tr from-primary-500 to-red-500
        hover:from-red-600 hover:to-primary-600
        text-white font-semibold rounded-2xl shadow-xl
        hover:shadow-2xl active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primary-300
        transition-all duration-200
        group overflow-hidden ${className}
      `}
      aria-label={`Add ${product?.title || 'product'} to cart`}
    >
      {/* Ripple effect */}
      <span className="absolute inset-0 group-active:bg-white/20 group-hover:bg-white/10 transition duration-300 rounded-2xl pointer-events-none" />
      {/* Cart Icon */}
      <span className="z-10 flex items-center">
        <CartIcon className="w-5 h-5 mr-2" />
        Add to Cart
      </span>
    </button>
  );
}

// SVG Cart Icon - No dependencies!
function CartIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="7" cy="16" r="1.5" fill="currentColor" />
      <circle cx="15" cy="16" r="1.5" fill="currentColor" />
      <path
        d="M2.5 3.5h2l2.28 9.12a1.25 1.25 0 0 0 1.21.88h6.5a1.25 1.25 0 0 0 1.21-.88l1.38-4.36a.75.75 0 0 0-.72-.98H7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
