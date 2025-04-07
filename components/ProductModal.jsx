// components/ProductModal.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductModal({
  isOpen,
  product,
  onClose,
  onAddToCart
}) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) {
    return null; // Don’t render if the modal is closed or no product is selected
  }

  // Calculate total based on product price * quantity
  const total = product.price * quantity;

  const handleAddToCart = () => {
    // Call the parent callback to actually add the item to the cart
    onAddToCart(product, quantity);
    // Close the modal
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="modal-content"
          className="bg-white w-full max-w-md rounded-lg shadow-lg relative p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            X
          </button>

          {/* Product Image */}
          <div className="w-full h-56 relative mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full rounded"
            />
          </div>

          {/* Product Title */}
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>

          {/* Description */}
          <p className="text-gray-600 mb-3">
            {product.description || 'Delicious and fresh.'}
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-2 mb-2">
            {/* Current price */}
            <span className="text-lg font-bold text-green-600">
              ${product.price.toFixed(2)}
            </span>
            {/* Optional original price */}
            {product.originalPrice && (
              <span className="text-sm line-through text-red-500">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Quantity & Unit */}
          <p className="text-gray-500 mb-1">
            {`Quantity (${product.unit || '1 pc'})`}
          </p>
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

          {/* Total */}
          <div className="mb-4">
            <span className="font-semibold">= ${total.toFixed(2)}</span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 w-full"
            aria-label="Add to cart"
          >
            Add to Cart
          </button>

          {/* Category (optional) */}
          {product.category && (
            <p className="text-sm text-gray-400 mt-4">
              Category: {product.category}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}