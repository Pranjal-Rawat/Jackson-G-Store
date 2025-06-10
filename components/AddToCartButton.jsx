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
    e.stopPropagation(); // Prevent event bubbling
    addToCart({ ...product, quantity, option });
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg ${className}`}
      aria-label={`Add ${product?.title || 'product'} to cart`}
    >
      Add to Cart
    </button>
  );
}
