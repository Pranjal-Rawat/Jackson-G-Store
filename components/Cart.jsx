'use client';

// Route: /components/Cart.jsx – Modern Polished Version

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

  // Memoized input handler for performance
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Robust validation for customer input
  const validateForm = useCallback(() => {
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
  }, [customer]);

  // Start checkout – show confirmation modal if valid
  const handleCheckout = useCallback(() => {
    if (!validateForm()) return;
    setShowConfirm(true);
  }, [validateForm]);

  // Confirm and perform redirect/stock update
  const confirmRedirect = useCallback(async () => {
    setShowConfirm(false);
    setIsRedirecting(true);
    try {
      // 1. Verify order and generate WhatsApp URL
      const response = await fetch('/api/verify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items.map((item) => ({
            _id: item._id,
            quantity: item.quantity,
            slug: item.slug,
            id: item.id,
          })),
          customer,
        }),
      });
      const data = await response.json();

      if (response.ok && data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');

        // 2. Reduce stock after WhatsApp confirmation
        await fetch('/api/reduce-stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems: items.map((item) => ({
              _id: item._id,
              quantity: item.quantity,
              slug: item.slug,
              id: item.id,
            })),
          }),
        });

        // 3. Clear cart
        clearCart();
      } else {
        alert(data.error || 'Failed to generate WhatsApp link.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsRedirecting(false);
    }
  }, [items, customer, clearCart]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff9f0] via-white to-[#fffbe7] text-gray-900 pt-[5.5rem] pb-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-8">
        <div className="flex items-center gap-2 mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#ed3237] hover:text-[#ffcc29] font-semibold transition"
            aria-label="Go back"
            type="button"
          >
            <FiArrowLeft className="h-5 w-5 mr-1" />
            Continue Shopping
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold ml-3 tracking-tight">
            My Cart <span className="text-[#ffcc29]">({count})</span>
          </h1>
        </div>

        <AnimatePresence>
          {items.length === 0 ? (
            // Empty Cart Animation
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-7xl mb-5"
                >
                  🛒
                </motion.div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">Your cart is empty</h2>
                <Link
                  href="/products"
                  className="inline-flex items-center bg-gradient-to-tr from-[#ed3237] to-[#ffcc29] hover:from-[#ffcc29] hover:to-[#ed3237] text-white px-7 py-3 rounded-2xl font-semibold shadow-lg transition"
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
              className="grid grid-cols-1 lg:grid-cols-3 gap-10"
            >
              {/* Cart Items */}
              <section className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="flex items-center bg-white rounded-2xl shadow-md p-5 border border-[#ffcc29]/10 hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#ffcc29]/30 bg-gradient-to-tr from-[#fffbe7] via-white to-[#fff6e3]">
                      <Image
                        src={item.image}
                        alt={item.title || 'Cart item'}
                        fill
                        className="object-contain"
                        sizes="80px"
                        priority
                      />
                    </div>
                    <div className="ml-6 flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-1">₹{item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-1 space-x-4">
                        <div className="flex items-center border border-[#ffcc29]/30 rounded-xl bg-[#fffde9]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1.5 text-lg font-bold text-gray-700 hover:bg-[#fff9f0] transition rounded-l-xl"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                            type="button"
                          >
                            −
                          </button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-lg font-bold text-gray-700 hover:bg-[#fff9f0] transition rounded-r-xl"
                            aria-label="Increase quantity"
                            type="button"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#ed3237] text-xs font-semibold hover:underline ml-2"
                          aria-label="Remove item"
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="font-bold text-xl text-[#ed3237] ml-6 text-right min-w-[90px]">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </motion.div>
                ))}

                {/* Customer Details */}
                <section className="bg-white p-7 rounded-2xl shadow-md border border-[#ffcc29]/20 mt-8">
                  <h2 className="text-lg font-bold mb-5 text-[#ed3237]">Customer Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name *"
                      value={customer.name}
                      onChange={handleInputChange}
                      className="border border-[#ffcc29]/30 rounded-xl p-3 focus:ring-2 focus:ring-[#ed3237] transition text-gray-900"
                      autoComplete="name"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={customer.phone}
                      onChange={handleInputChange}
                      className="border border-[#ffcc29]/30 rounded-xl p-3 focus:ring-2 focus:ring-[#ed3237] transition text-gray-900"
                      autoComplete="tel"
                      required
                    />
                    <textarea
                      name="address"
                      placeholder="Delivery Address *"
                      value={customer.address}
                      onChange={handleInputChange}
                      className="md:col-span-2 border border-[#ffcc29]/30 rounded-xl p-3 focus:ring-2 focus:ring-[#ed3237] transition text-gray-900"
                      rows="3"
                      autoComplete="street-address"
                      required
                    />
                    <select
                      name="paymentMethod"
                      value={customer.paymentMethod}
                      onChange={handleInputChange}
                      className="md:col-span-2 border border-[#ffcc29]/30 rounded-xl p-3 focus:ring-2 focus:ring-[#ed3237] transition text-gray-900"
                    >
                      <option value="cash">Cash on Delivery</option>
                      <option value="online">Online Payment</option>
                    </select>
                  </div>
                </section>
              </section>

              {/* Order Summary */}
              <aside className="bg-white p-7 rounded-2xl shadow-lg border border-[#ffcc29]/40 sticky top-24 self-start">
                <h2 className="text-lg font-bold mb-5 text-[#ed3237]">Order Summary</h2>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-700">Subtotal ({count} items)</span>
                  <span className="font-bold text-[#ed3237]">₹{total.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-tr from-[#ed3237] to-[#ffcc29] hover:from-[#ffcc29] hover:to-[#ed3237] text-white py-3 mt-3 rounded-xl font-bold shadow-md transition-transform active:scale-95"
                  disabled={isRedirecting}
                  type="button"
                >
                  {isRedirecting ? 'Redirecting...' : 'Proceed to Checkout'}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full mt-4 border border-[#ed3237] text-[#ed3237] hover:bg-[#fff6e3] py-3 rounded-xl font-bold transition-colors"
                  type="button"
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
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-[#ffcc29]/40"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <h2 className="text-lg font-bold mb-4 text-[#ed3237]">Confirm Order</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Proceed to place your order on WhatsApp with the above details?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={confirmRedirect}
                    className="flex-1 bg-gradient-to-tr from-[#ed3237] to-[#ffcc29] hover:from-[#ffcc29] hover:to-[#ed3237] text-white py-2 rounded-xl font-bold transition"
                    type="button"
                  >
                    Yes, Confirm
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 border border-[#ed3237] text-[#ed3237] py-2 rounded-xl font-bold hover:bg-[#fff6e3] transition"
                    type="button"
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
