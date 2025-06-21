'use client';

// Route: /components/ProductModal.jsx – Product details + add to cart modal

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AddToCartButton from './AddToCartButton';

export default function ProductModal({ isOpen, product, onClose, onAddToCart }) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);

  // Fetch product + related when modal opens
  useEffect(() => {
    let isMounted = true;
    if (isOpen && product?.slug) {
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
    } else {
      setDetails(null);
      setQuantity(1);
      setSelectedOption(null);
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Show loader while fetching
  if (loading || !details) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 shadow text-center">
          <span className="text-lg font-semibold text-gray-600">Loading…</span>
        </div>
      </div>
    );
  }

  const { product: p, related } = details;
  const stock = p.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const total = (p.price || 0) * quantity;

  // Memoize handlers for performance
  const handleAdd = useCallback(() => {
    if (!isOutOfStock && onAddToCart) {
      onAddToCart(p, quantity, selectedOption);
      onClose();
    }
  }, [isOutOfStock, onAddToCart, p, quantity, selectedOption, onClose]);

  const handleQuantityChange = (delta) => setQuantity((q) => Math.max(1, q + delta));

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label={`Product Details – ${p.title}`}
      >
        <motion.div
          className="bg-white w-full max-w-2xl rounded-2xl shadow-lg relative p-6"
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 0.25 } }}
          exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.18 } }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
            aria-label="Close product details modal"
            type="button"
          >
            &times;
          </button>

          {/* Out of Stock Badge */}
          {isOutOfStock && (
            <span className="absolute top-3 left-3 z-10 bg-red-600 text-white px-2 py-0.5 rounded-full font-bold text-xs shadow">
              Out of Stock
            </span>
          )}

          {/* Image */}
          <div
            className={`relative w-full h-56 rounded-lg overflow-hidden mb-4 ${isOutOfStock ? 'opacity-70 grayscale' : ''}`}
            itemScope
            itemType="https://schema.org/Product"
          >
            <Image
              src={p.image || '/images/logo.svg'}
              alt={`${p.title} – Buy online in Dehradun at Jackson Grocery Store`}
              fill
              className="object-contain bg-white"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />
            <meta itemProp="name" content={p.title} />
            <meta itemProp="description" content={p.description || 'Delicious and fresh.'} />
            <meta itemProp="sku" content={p.slug} />
            <meta itemProp="image" content={p.image || '/images/logo.svg'} />
          </div>

          {/* Title and Description */}
          <h2 className="text-xl font-bold text-gray-800 mb-2" itemProp="name">
            {p.title}
          </h2>
          <p className="text-gray-600 mb-3" itemProp="description">
            {p.description || 'Delicious and fresh.'}
          </p>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg font-bold text-red-600" itemProp="offers" itemScope itemType="https://schema.org/Offer">
              ₹{(p.price || 0).toFixed(2)}
              <meta itemProp="priceCurrency" content="INR" />
              <meta itemProp="price" content={(p.price || 0).toFixed(2)} />
              <link itemProp="availability" href={isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"} />
            </span>
            {p.originalPrice && (
              <span className="text-sm line-through text-gray-400">
                ₹{p.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Options */}
          {p.options?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Select Option:</p>
              <div className="flex flex-wrap gap-2">
                {p.options.map((option, index) => (
                  <label
                    key={index}
                    className={`cursor-pointer border px-3 py-1 rounded-lg text-sm ${
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
                      disabled={isOutOfStock}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-3 mb-4">
            <p className="text-sm text-gray-500">Quantity ({p.unit || '1 pc'})</p>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-3 py-1 hover:bg-gray-100"
                aria-label="Decrease quantity"
                disabled={isOutOfStock || quantity <= 1}
                type="button"
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-3 py-1 hover:bg-gray-100"
                aria-label="Increase quantity"
                disabled={isOutOfStock}
                type="button"
              >
                +
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="mb-4 text-sm text-gray-600">
            Total: <span className="font-semibold text-red-600">₹{total.toFixed(2)}</span>
          </div>

          {/* Add to Cart */}
          <motion.button
            onClick={handleAdd}
            whileHover={isOutOfStock ? {} : { scale: 1.02 }}
            whileTap={isOutOfStock ? {} : { scale: 0.98 }}
            className={`w-full py-3 rounded-lg transition-colors mb-4 font-bold
              ${isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'}
            `}
            aria-label={isOutOfStock ? 'Out of Stock' : `Add ${quantity} ${p.title} to cart`}
            disabled={isOutOfStock}
            type="button"
          >
            {isOutOfStock ? 'Out of Stock' : `Add to Cart (${quantity})`}
          </motion.button>

          {/* Related Products */}
          {related && related.length > 0 && (
            <>
              <div className="font-semibold mb-2 mt-4 text-lg">Related Products</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {related.map((rp, i) => {
                  const rpStock = rp.stock ?? 0;
                  const rpOut = rpStock <= 0;
                  return (
                    <div
                      key={rp._id}
                      className="bg-gray-50 p-3 rounded-xl shadow flex flex-col items-center"
                      itemScope
                      itemType="https://schema.org/Product"
                    >
                      <div className="relative w-16 h-16 mb-2">
                        <Image
                          src={rp.image || '/images/logo.svg'}
                          alt={`${rp.title} – Buy online in Dehradun`}
                          fill
                          className={`object-contain rounded ${rpOut ? 'opacity-60 grayscale' : ''}`}
                          sizes="64px"
                          // First related: eager load, others lazy for performance
                          {...(i === 0 ? { priority: true } : { loading: "lazy" })}
                        />
                        {rpOut && (
                          <span className="absolute top-1 left-1 bg-red-600 text-white px-1 py-0.5 rounded-full text-[10px] font-bold shadow">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-center mb-1 truncate w-full">
                        {rp.title}
                      </div>
                      <div className="text-red-600 font-bold text-sm mb-1">
                        ₹{typeof rp.price === 'number' ? rp.price.toFixed(2) : 'N/A'}
                      </div>
                      <AddToCartButton product={rp} className="mt-1 py-1 px-2 text-xs" disabled={rpOut} />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
