// components/Cart.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCartStore } from '@/stores/cartStore';

export default function Cart() {
  const { items, count, total, removeItem, updateQuantity, clearCart } = useCartStore();
  const router = useRouter();

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: 'cash'
  });

  const handleDetailChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value
    });
  };

  // Compute total discount if any item has an originalPrice
  const discount = items.reduce((acc, item) => {
    if (item.originalPrice) {
      return acc + (item.originalPrice - item.price) * item.quantity;
    }
    return acc;
  }, 0);

  // Original total = final total + discount (only for items with discount)
  const originalTotal = total + discount;

  const generateWhatsAppMessage = () => {
    const customerInfo = `
Name: ${customerDetails.name}
Address: ${customerDetails.address}
Phone: ${customerDetails.phone}
Payment Method: ${customerDetails.paymentMethod}
    `.trim();

    const orderDetails = items
      .map(
        item =>
          `${item.title} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
      )
      .join('%0A');

    return `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Order Details:%0A${customerInfo}%0A%0A${orderDetails}%0A%0AOriginal Price: $${originalTotal.toFixed(
      2
    )}%0ATotal Discount: $${discount.toFixed(
      2
    )}%0AFinal Total: $${total.toFixed(2)}%0AConfirm Order?`.replace(/\n/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-red-600"
            aria-label="Go back"
          >
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold ml-4">My Cart ({count})</h1>
        </div>

        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl mb-4"
                >
                  😞
                </motion.div>
                <h2 className="text-2xl font-bold mb-4">Your cart feels lonely!</h2>
                <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
                <Link
                  href="/products"
                  className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <FiShoppingBag className="mr-2" />
                  Start Shopping
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cart-items"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="p-4 flex"
                    >
                      <div className="relative h-24 w-24 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover rounded-lg"
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium">{item.title}</h3>
                        <div className="flex gap-4 mt-1">
                          <p className="text-red-600 font-semibold">
                            Price: ${item.price.toFixed(2)}
                          </p>
                          <p className="text-red-600 font-semibold">
                            Total: ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex items-center mt-2">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-100"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-4 text-red-600 hover:text-red-700 text-sm"
                            aria-label="Remove item"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Customer Details Form */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Customer Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={customerDetails.name}
                        onChange={handleDetailChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={customerDetails.phone}
                        onChange={handleDetailChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Address *
                      </label>
                      <textarea
                        name="address"
                        value={customerDetails.address}
                        onChange={handleDetailChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        rows="3"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method *
                      </label>
                      <select
                        name="paymentMethod"
                        value={customerDetails.paymentMethod}
                        onChange={handleDetailChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="cash">Cash on Delivery</option>
                        <option value="online">Online Payment</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-8">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="flex justify-between items-center mb-4">
                  <span>Subtotal ({count} items)</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Original Price: <span className="line-through">${originalTotal.toFixed(2)}</span>
                    </p>
                    <p className="text-sm text-green-600">
                      You saved: ${discount.toFixed(2)}
                    </p>
                  </div>
                )}

                <a
                  href={generateWhatsAppMessage()}
                  onClick={(e) => {
                    if (!customerDetails.name || !customerDetails.address || !customerDetails.phone) {
                      e.preventDefault();
                      alert('Please fill all required fields marked with *');
                    }
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-red-500 hover:bg-red-600 text-white py-3 text-center rounded-lg transition-colors"
                >
                  Proceed to Checkout
                </a>
                
                <button
                  onClick={clearCart}
                  className="w-full mt-4 text-red-500 hover:text-red-600 border border-red-500 py-3 rounded-lg transition-colors"
                  aria-label="Clear cart"
                >
                  Clear Cart
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}