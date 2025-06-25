'use client';

// Route: /components/ProductModal.jsx – Product details + add to cart modal with MRP, unit, pcs
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';

export default function ProductModal({ isOpen, product, onClose, onAddToCart }) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (!isOpen || !product?.slug) return;

    let isMounted = true;
    setLoading(true);

    fetch(`/api/products/${product.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setQuantity(1);
          setSelectedOption(data.product?.options?.[0] || null);
        }
      })
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, [isOpen, product?.slug]);

  if (!isOpen || !product) return null;

  if (loading || !details) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white px-8 py-6 rounded-xl shadow text-center">
          <span className="text-base font-medium text-gray-600">Loading product…</span>
        </div>
      </div>
    );
  }

  const { product: p, related = [] } = details;
  const isOutOfStock = (p.stock ?? 0) <= 0;
  const unit = p.unit || p.quantity || '';
  const pcs = p.pcs || p.pieces || '';
  const mrp = parseFloat(p.mrp || 0);
  const price = parseFloat(p.price || 0);
  const total = quantity * price;

  const handleQuantityChange = (delta) =>
    setQuantity((prev) => Math.max(1, prev + delta));

  const handleAdd = useCallback(() => {
    if (!isOutOfStock && onAddToCart) {
      onAddToCart(p, quantity, selectedOption);
      onClose();
    }
  }, [isOutOfStock, onAddToCart, p, quantity, selectedOption, onClose]);

  return (
    <AnimatePresence>
      <motion.div
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
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-xl text-gray-500 hover:text-gray-800"
            aria-label="Close modal"
          >
            &times;
          </button>

          {/* Out of Stock */}
          {isOutOfStock && (
            <span className="absolute top-3 left-4 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
              Out of Stock
            </span>
          )}

          {/* Image */}
          <div className={`relative w-full h-56 rounded-lg overflow-hidden mb-4 ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}>
            <Image
              src={p.image || '/images/logo.svg'}
              alt={p.title}
              fill
              className="object-contain bg-white"
              sizes="(max-width: 768px) 100vw, 500px"
              placeholder="blur"
              blurDataURL="/images/placeholder.png"
              priority
            />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800">{p.title}</h2>
          <p className="text-sm text-gray-600 mb-2">{p.description || 'Product details'}</p>

          {/* Unit & Pieces */}
          <div className="flex gap-3 text-sm text-gray-500 mb-2">
            {unit && <span>{unit}</span>}
            {pcs && <span>{pcs} pcs</span>}
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-3 mb-4">
            {mrp > price && (
              <span className="text-sm line-through text-gray-400">₹{mrp.toFixed(2)}</span>
            )}
            <span className="text-lg font-bold text-red-600">₹{price.toFixed(2)}</span>
          </div>

          {/* Options */}
          {p.options?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Options:</p>
              <div className="flex flex-wrap gap-2">
                {p.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`cursor-pointer px-3 py-1 text-sm rounded border ${
                      selectedOption?.value === option.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="productOption"
                      value={option.value}
                      checked={selectedOption?.value === option.value}
                      onChange={() => setSelectedOption(option)}
                      className="hidden"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-4">
            <p className="text-sm text-gray-500">Qty</p>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-1 text-lg font-bold text-gray-700 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-1 text-lg font-bold text-gray-700 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="text-sm mb-4 text-gray-600">
            Total: <span className="font-semibold text-red-600">₹{total.toFixed(2)}</span>
          </div>

          {/* Add to Cart */}
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Out of Stock' : `Add to Cart (${quantity})`}
          </motion.button>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-base mb-2">Related Products</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {related.map((rp) => {
                  const out = (rp.stock ?? 0) <= 0;
                  const mrp = parseFloat(rp.mrp || 0);
                  const price = parseFloat(rp.price || 0);

                  return (
                    <div
                      key={rp._id}
                      className="bg-gray-50 p-3 rounded-xl shadow flex flex-col items-center"
                    >
                      <div className="relative w-16 h-16 mb-2">
                        <Image
                          src={rp.image || '/images/logo.svg'}
                          alt={rp.title}
                          fill
                          className={`object-contain ${out ? 'opacity-60 grayscale' : ''}`}
                          sizes="64px"
                          loading="lazy"
                        />
                        {out && (
                          <span className="absolute top-1 left-1 text-[10px] bg-red-600 text-white px-1 py-0.5 rounded-full font-bold">
                            Out
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-center truncate w-full">
                        {rp.title}
                      </div>
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
                })}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}