'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';

export default function Cart() {
  const { items, count, total, removeItem, updateQuantity, clearCart } = useCartStore();
  const router = useRouter();

  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: 'cash',
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateForm = () => {
    if (customer.name.trim().length < 3) {
      alert('Full name must be at least 3 characters.');
      return false;
    }
    if (!/^\d{10}$/.test(customer.phone)) {
      alert('Phone number must be 10 digits.');
      return false;
    }
    if (customer.address.trim().length < 10) {
      alert('Address must be at least 10 characters.');
      return false;
    }
    return true;
  };

  const handleCheckout = useCallback(async () => {
    if (!validateForm()) return;
    setShowConfirm(true);
  }, [customer]);

  const confirmRedirect = async () => {
    setShowConfirm(false);
    setIsRedirecting(true);
    try {
      const response = await fetch('/api/verify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          customer,
        }),
      });

      const data = await response.json();
      if (response.ok && data.whatsappUrl) {
        window.location.href = data.whatsappUrl;
      } else {
        alert(data.error || 'Failed to generate WhatsApp link.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-800">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-500 hover:text-primary-600 font-medium transition-colors"
            aria-label="Go back"
          >
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold ml-4 tracking-tight">My Cart <span className="text-primary-600">({count})</span></h1>
        </div>

        <AnimatePresence>
          {items.length === 0 ? (
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-14"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-7xl mb-4"
                >
                  🛒
                </motion.div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">Your cart is empty</h2>
                <Link
                  href="/products"
                  className="inline-flex items-center bg-gradient-to-tr from-primary-500 to-red-500 hover:from-red-600 hover:to-primary-600 text-white px-7 py-3 rounded-2xl font-semibold shadow-lg transition"
                >
                  <FiShoppingBag className="mr-2" />
                  Start Shopping
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="cart-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Cart Items */}
              <section className="lg:col-span-2 space-y-5">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="flex items-center bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 bg-gradient-to-tr from-gray-100 via-white to-gray-50">
                      <Image
                        src={item.image}
                        alt={item.title || 'Cart item'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-5 flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-1">₹{item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1.5 text-lg font-bold text-gray-700 hover:bg-gray-200 transition rounded-l-xl"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-lg font-bold text-gray-700 hover:bg-gray-200 transition rounded-r-xl"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 text-xs font-medium hover:underline ml-2"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="font-bold text-xl text-primary-600 ml-5 text-right min-w-[90px]">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </motion.div>
                ))}

                {/* Customer Details */}
                <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mt-5">
                  <h2 className="text-lg font-bold mb-4 text-gray-800">Customer Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={customer.name}
                      onChange={handleInputChange}
                      className="border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-400 transition text-gray-700"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={customer.phone}
                      onChange={handleInputChange}
                      className="border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-400 transition text-gray-700"
                    />
                    <textarea
                      name="address"
                      placeholder="Delivery Address *"
                      value={customer.address}
                      onChange={handleInputChange}
                      className="md:col-span-2 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-400 transition text-gray-700"
                      rows="3"
                    />
                    <select
                      name="paymentMethod"
                      value={customer.paymentMethod}
                      onChange={handleInputChange}
                      className="md:col-span-2 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-400 transition text-gray-700"
                    >
                      <option value="cash">Cash on Delivery</option>
                      <option value="online">Online Payment</option>
                    </select>
                  </div>
                </section>
              </section>

              {/* Order Summary */}
              <aside className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-8">
                <h2 className="text-lg font-bold mb-4 text-gray-800">Order Summary</h2>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Subtotal ({count} items)</span>
                  <span className="font-bold text-primary-600">₹{total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-tr from-primary-500 to-red-500 hover:from-red-600 hover:to-primary-600 text-white py-3 mt-3 rounded-xl font-bold shadow-md transition-transform active:scale-95"
                  disabled={isRedirecting}
                >
                  {isRedirecting ? 'Redirecting...' : 'Proceed to Checkout'}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full mt-4 border border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-xl font-bold transition-colors"
                >
                  Clear Cart
                </button>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-100"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <h2 className="text-lg font-bold mb-4 text-gray-800">Confirm Order</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Proceed to place your order on WhatsApp with the above details?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={confirmRedirect}
                    className="flex-1 bg-gradient-to-tr from-primary-500 to-red-500 hover:from-red-600 hover:to-primary-600 text-white py-2 rounded-xl font-bold transition"
                  >
                    Yes, Confirm
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 border border-red-500 text-red-500 py-2 rounded-xl font-bold hover:bg-red-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
