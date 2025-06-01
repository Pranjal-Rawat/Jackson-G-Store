// components/ProductModal.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ProductModal({ isOpen, product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);

  // Reset quantity and set the default option (if available) whenever the product changes
  useEffect(() => {
    setQuantity(1);
    if (product?.options && product.options.length > 0) {
      setSelectedOption(product.options[0]);
    } else {
      setSelectedOption(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const total = product.price * quantity;

  const handleAddToCart = () => {
    // Explicitly pass the selected quantity to ensure it's not using a default value
    onAddToCart(product, quantity, selectedOption);
    onClose();
  };

  // Animation variants for overlay and modal content
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          className="bg-white w-full max-w-md rounded-lg shadow-lg relative p-6"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            &times;
          </button>

          <div className="w-full h-56 relative mb-4">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

          <h2 className="text-xl font-bold mb-2 text-gray-800">{product.name || product.title}</h2>
          <p className="text-gray-600 mb-3">{product.description || 'Delicious and fresh.'}</p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm line-through text-red-500">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* If the product supports options, render them */}
          {product.options && product.options.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-500 mb-1">Select Option:</p>
              <div className="flex flex-wrap gap-2">
                {product.options.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-1 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="productOption"
                      value={option.value}
                      checked={selectedOption?.value === option.value}
                      onChange={() => setSelectedOption(option)}
                      className="form-radio text-red-500"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-500 mb-1">Quantity ({product.unit || '1 pc'})</p>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="mb-4">
            <span className="font-semibold">Total: ${total.toFixed(2)}</span>
          </div>

          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-green-600 text-white py-2 px-4 rounded w-full hover:bg-green-700 transition-colors"
            aria-label="Add to cart"
          >
            Add to Cart ({quantity})
          </motion.button>

          {product.category && (
            <p className="text-sm text-gray-400 mt-4">Category: {product.category}</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}