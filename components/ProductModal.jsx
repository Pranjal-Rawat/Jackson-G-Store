// /components/ProductModal.jsx

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ProductModal({ isOpen, product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedOption(product?.options?.[0] || null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const total = product.price * quantity;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedOption);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          className="bg-white w-full max-w-md rounded-2xl shadow-lg relative p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 0.3 } }}
          exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>

          {/* Image */}
          <div className="relative w-full h-56 rounded-lg overflow-hidden mb-4">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

          {/* Title and Description */}
          <h2 className="text-xl font-bold text-gray-800 mb-2">{product.title}</h2>
          <p className="text-gray-600 mb-3">{product.description || 'Delicious and fresh.'}</p>

          {/* Price Section */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg font-bold text-red-600">₹{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm line-through text-gray-400">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Options Section */}
          {product.options?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Select Option:</p>
              <div className="flex flex-wrap gap-2">
                {product.options.map((option, index) => (
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
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-3 mb-4">
            <p className="text-sm text-gray-500">Quantity ({product.unit || '1 pc'})</p>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 hover:bg-gray-100"
                aria-label="Increase quantity"
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
            aria-label={`Add ${quantity} ${product.title} to cart`}
          >
            Add to Cart ({quantity})
          </motion.button>

          {/* Optional Category */}
          {product.category && (
            <p className="text-xs text-gray-400 mt-4">Category: {product.category}</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
