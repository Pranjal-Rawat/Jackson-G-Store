'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCartStore } from '../stores/cartStore';

/* ------------------------------------------------------------------ */
/*   Cart icon (unchanged)                                            */
/* ------------------------------------------------------------------ */
const CartIcon = React.memo(function CartIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="7"  cy="16" r="1.5" fill="#ed3237" />
      <circle cx="15" cy="16" r="1.5" fill="#ed3237" />
      <path
        d="M2.5 3.5h2l2.28 9.12a1.25 1.25 0 0 0 1.21.88h6.5a1.25 1.25 0 0 0 1.21-.88l1.38-4.36a.75.75 0 0 0-.72-.98H7"
        stroke="#ed3237"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

/* ------------------------------------------------------------------ */
/*   Tiny toast shown when stock is exhausted                         */
/* ------------------------------------------------------------------ */
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[1000] animate-toast-in">
      <div className="bg-red-600 text-white px-4 py-2 rounded shadow-lg">
        {message}
      </div>
    </div>,
    document.body
  );
}

/* ------------------------------------------------------------------ */
/*   Main button                                                      */
/* ------------------------------------------------------------------ */
export default function AddToCartButton({
  product,
  quantity = 1,
  option   = null,
  className = '',
  disabled  = false,
}) {
  const addItem        = useCartStore((s) => s.addItem);
  const getVirtualStock = useCartStore((s) => s.getVirtualStock);

  // Flexible product id getter
  const productId = product?.id ?? product?._id ?? product?.productId ?? product?.slug;
  const realStock = product?.stock ?? 0;

  // Virtual stock (live: real stock - in cart)
  const virtualStock = getVirtualStock(productId, realStock, option);

  // Disable if not enough stock
  const isDisabled = disabled || !product?.title || virtualStock <= 0;

  const [toast, setToast] = useState(false);

  const handleAdd = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDisabled) return;

      // Only allow up to virtualStock, pass as maxStock to enforce
      const ok = await addItem({ ...product, option }, quantity, option, virtualStock);
      if (!ok) setToast(true);
    },
    [isDisabled, addItem, product, quantity, option, virtualStock]
  );

  return (
    <>
      <button
        type="button"
        onClick={handleAdd}
        disabled={isDisabled}
        aria-label={
          isDisabled ? 'Out of Stock' : `Add ${product?.title || ''} to cart`
        }
        tabIndex={isDisabled ? -1 : 0}
        style={{ WebkitTapHighlightColor: 'transparent' }}
        className={[
          'relative inline-flex items-center justify-center gap-1',
          'px-3 py-2 sm:px-4 sm:py-2.5',
          'bg-gradient-to-tr from-[#ed3237] via-[#ff5d38] to-[#ffcc29]',
          'hover:from-[#ffcc29] hover:via-[#ed3237] hover:to-[#ffcc29]',
          'text-white font-bold rounded-full shadow-md',
          'shadow-[#ed323760]/20 hover:shadow-[#ffcc2940]/40',
          'transition-all duration-200 group overflow-hidden text-sm sm:text-base',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcc29]/70',
          'active:scale-97 hover:scale-102 select-none backdrop-blur-sm',
          isDisabled ? 'opacity-50 cursor-not-allowed' : '',
          className,
        ].join(' ')}
      >
        {/* shimmer */}
        <span className="absolute inset-0 z-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/20 transition-all duration-200 rounded-full pointer-events-none backdrop-blur-sm" />

        {/* content */}
        <span className="relative z-10 flex items-center justify-center">
          <span className="bg-[#ffcc29]/90 p-1 rounded-full mr-1 sm:mr-2 flex items-center justify-center shadow-inner shadow-[#ed3237]/10">
            <CartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#ed3237]" />
          </span>

          <span className="font-semibold tracking-wide drop-shadow-sm">
            <span className="block sm:hidden">
              {isDisabled ? 'Out' : 'Add'}
            </span>
            <span className="hidden sm:inline">
              {isDisabled ? 'Out of Stock' : 'Add to Cart'}
            </span>
          </span>
        </span>
      </button>

      {/* toast */}
      {toast && (
        <Toast message="Item out of stock" onClose={() => setToast(false)} />
      )}

      {/* minimal keyframes for slide-in */}
      <style jsx global>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-toast-in { animation: toast-in 0.25s ease-out both; }
      `}</style>
    </>
  );
}
