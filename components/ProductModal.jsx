'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';
import { useCartStore } from '../stores/cartStore';
import { getOptimizedCloudinaryUrl } from '../app/lib/getOptimizedCloudinaryUrl';

function RelatedCard({ rp }) {
  const getVirtualStock = useCartStore((s) => s.getVirtualStock);
  const virtualStock = getVirtualStock(rp._id ?? rp.id ?? rp.slug, rp.stock);
  const out = (rp.stock ?? 0) <= 0 || virtualStock <= 0;
  const mrp = +rp.mrp || 0;
  const price = +rp.price || 0;
  // Cloudinary optimized
  const imageSrc = rp.image?.includes('cloudinary.com')
    ? getOptimizedCloudinaryUrl(rp.image)
    : rp.image || '/images/logo.svg';

  return (
    <div className="bg-gray-50 p-3 rounded-xl shadow flex flex-col items-center">
      <div className="relative w-16 h-16 mb-2">
        <Image
          src={imageSrc}
          alt={rp.title}
          fill
          className={`object-contain ${out ? 'opacity-60 grayscale' : ''}`}
          sizes="64px"
          loading="lazy"
          placeholder="empty"
        />
        {out && (
          <span className="absolute top-1 left-1 text-[10px] bg-red-600 text-white px-1 py-0.5 rounded-full font-bold">
            Out
          </span>
        )}
        {!out && virtualStock <= 3 && (
          <span className="absolute top-1 right-1 text-[10px] bg-yellow-400 text-black px-1 py-0.5 rounded font-semibold">
            {virtualStock} left
          </span>
        )}
      </div>

      <div className="text-xs font-semibold text-center truncate w-full">{rp.title}</div>
      <div className="text-xs text-gray-500">
        ₹{price.toFixed(2)}
        {mrp > price && (
          <span className="ml-1 line-through text-[11px] text-gray-400">
            ₹{mrp.toFixed(2)}
          </span>
        )}
      </div>
      <AddToCartButton product={rp} className="mt-1 py-1 px-2 text-xs" disabled={out} />
    </div>
  );
}

export default function ProductModal({ isOpen, product, onClose, onAddToCart }) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(null);
  const modalRef = useRef();

  const getVirtualStock = useCartStore((s) => s.getVirtualStock);

  // Handle ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Trap focus for accessibility
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const modal = modalRef.current;
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
    const handleTab = (e) => {
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, [isOpen, details]);

  useEffect(() => {
    if (!isOpen || !product?.slug) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${product.slug}`);
        const data = await res.json();
        if (alive) {
          setDetails(data);
          setQuantity(1);
          setSelected(data.product?.options?.[0] || null);
        }
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [isOpen, product?.slug]);

  if (!isOpen || !product) return null;
  if (loading || !details)
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white px-8 py-6 rounded-xl shadow text-center">
          <span className="text-base font-medium text-gray-600">
            Loading product…
          </span>
        </div>
      </div>
    );

  const { product: p, related = [] } = details;
  const stock = p.stock ?? 0;
  const productId = p._id ?? p.id ?? p.slug;
  const virtualStock = getVirtualStock(productId, stock);
  const isOutOfStock = stock <= 0 || virtualStock <= 0;

  const unit = p.unit || p.quantity || '';
  const pcs = p.pcs || p.pieces || '';
  const mrp = +p.mrp || 0;
  const price = +p.price || 0;
  const total = quantity * price;

  const imageSrc = p.image?.includes('cloudinary.com')
    ? getOptimizedCloudinaryUrl(p.image)
    : p.image || '/images/logo.svg';

  const changeQty = (d) =>
    setQuantity((q) => {
      const next = Math.max(1, Math.min(q + d, virtualStock));
      return next;
    });

  // auto-clamp qty if stock reduced while open
  useEffect(() => {
    setQuantity((q) => Math.max(1, Math.min(q, virtualStock)));
  }, [virtualStock]);

  const handleAdd = useCallback(() => {
    if (!isOutOfStock && onAddToCart) {
      onAddToCart(p, quantity, selected);
      onClose();
    }
  }, [isOutOfStock, onAddToCart, p, quantity, selected, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label={`Details of ${p.title}`}
      >
        <motion.div
          className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-xl text-gray-500 hover:text-gray-800"
            aria-label="Close modal"
            tabIndex={0}
            autoFocus
          >
            &times;
          </button>

          {/* Stock badges */}
          {isOutOfStock && (
            <span className="absolute top-3 left-4 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              Out of Stock
            </span>
          )}
          {!isOutOfStock && virtualStock <= 3 && (
            <span className="absolute top-3 left-28 bg-yellow-400 text-black text-xs font-semibold px-2 py-0.5 rounded shadow">
              {virtualStock} left
            </span>
          )}

          {/* Main image */}
          <div
            className={`relative w-full h-56 rounded-lg overflow-hidden mb-4 ${
              isOutOfStock ? 'opacity-60 grayscale' : ''
            }`}
          >
            <Image
              src={imageSrc}
              alt={p.title}
              fill
              className="object-contain bg-white"
              sizes="(max-width: 768px) 100vw, 500px"
              placeholder="empty"
              priority
            />
          </div>

          <h2 className="text-xl font-bold text-gray-800">{p.title}</h2>
          <p className="text-sm text-gray-600 mb-2">{p.description || 'Product details'}</p>
          <div className="flex gap-3 text-sm text-gray-500 mb-2">
            {unit && <span>{unit}</span>}
            {pcs && <span>{pcs} pcs</span>}
          </div>
          <div className="flex items-center gap-3 mb-4">
            {mrp > price && (
              <span className="text-sm line-through text-gray-400">
                ₹{mrp.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-bold text-red-600">
              ₹{price.toFixed(2)}
            </span>
          </div>

          {/* options */}
          {p.options?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Options:</p>
              <div className="flex flex-wrap gap-2">
                {p.options.map((opt, i) => (
                  <label
                    key={i}
                    className={`cursor-pointer px-3 py-1 text-sm rounded border ${
                      selected?.value === opt.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="productOption"
                      value={opt.value}
                      checked={selected?.value === opt.value}
                      onChange={() => setSelected(opt)}
                      className="hidden"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* quantity picker */}
          <div className="flex items-center gap-4 mb-4">
            <p className="text-sm text-gray-500">Qty</p>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => changeQty(-1)}
                className="px-3 py-1 text-lg font-bold text-gray-700 hover:bg-gray-100"
                disabled={quantity <= 1}
                tabIndex={0}
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => changeQty(1)}
                className="px-3 py-1 text-lg font-bold text-gray-700 hover:bg-gray-100"
                disabled={quantity >= virtualStock}
                tabIndex={0}
              >
                +
              </button>
            </div>
            {virtualStock < 10 && !isOutOfStock && (
              <span className="ml-2 text-xs text-yellow-600 font-semibold">
                Only {virtualStock} left
              </span>
            )}
          </div>

          {/* total */}
          <div className="text-sm mb-4 text-gray-600">
            Total: <span className="font-semibold text-red-600">₹{total.toFixed(2)}</span>
          </div>

          {/* add-to-cart */}
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            disabled={isOutOfStock}
            tabIndex={0}
          >
            {isOutOfStock ? 'Out of Stock' : `Add to Cart (${quantity})`}
          </motion.button>

          {/* related */}
          {related.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-base mb-2">Related Products</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {related.map((rp) => (
                  <RelatedCard key={rp._id} rp={rp} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
