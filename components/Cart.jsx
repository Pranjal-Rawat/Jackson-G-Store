'use client';

import { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../stores/cartStore';

// Lazy load modal and toast
const ConfirmationModal = dynamic(() => import('./ConfirmationModal'), { ssr: false });
const Toast = dynamic(() => import('./Toast'), { ssr: false });

// Inline SVG for icons to avoid react-icons bundle
const ArrowLeftIcon = () => (
  <svg width="20" height="20" fill="none" stroke="#ed3237" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M15 19l-7-7 7-7" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 2l1 7h10l1-7zM5 10v12h14V10" />
  </svg>
);

// ... Toast and ConfirmationModal would be their own files for dynamic import ...

export default function Cart() {
  const {
    items, count, total, removeItem, updateQuantity, clearCart,
  } = useCartStore();
  const router = useRouter();

  const [customer, setCustomer] = useState({
    name: '', address: '', phone: '', paymentMethod: 'cash',
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [toast, setToast] = useState('');

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  }, []);

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

  const handleCheckout = useCallback(() => {
    if (!validateForm()) return;
    setShowConfirm(true);
  }, [validateForm]);

  const confirmRedirect = useCallback(async () => {
    setShowConfirm(false);
    setIsRedirecting(true);
    try {
      const response = await fetch('/api/verify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items.map((i) => ({
            _id: i._id, quantity: i.quantity, slug: i.slug, id: i.id,
          })),
          customer,
        }),
      });
      const data = await response.json();

      if (response.ok && data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
        await fetch('/api/reduce-stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems: items.map((i) => ({
              _id: i._id, quantity: i.quantity, slug: i.slug, id: i.id,
            })),
          }),
        });
        clearCart();
      } else {
        alert(data.error || 'Failed to generate WhatsApp link.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsRedirecting(false);
    }
  }, [items, customer, clearCart]);

  // --- Render ---
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff9f0] via-white to-[#fffbe7] text-gray-900 pt-[5.5rem] pb-8">
      <h1 className="sr-only">Your Cart</h1>
      <div className="max-w-7xl mx-auto px-3 sm:px-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#ed3237] hover:text-[#ffcc29] font-semibold transition"
            aria-label="Go back"
            type="button"
          >
            <ArrowLeftIcon />
            <span className="ml-1">Continue Shopping</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-extrabold ml-3 tracking-tight">
            My Cart <span className="text-[#ffcc29]">({count})</span>
          </h2>
        </div>

        {/* Cart body */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-7xl mb-5">🛒</div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                Your cart is empty
              </h2>
              <Link
                href="/products"
                className="inline-flex items-center bg-gradient-to-tr from-[#ed3237] to-[#ffcc29] hover:from-[#ffcc29] hover:to-[#ed3237] text-white px-7 py-3 rounded-2xl font-semibold shadow-lg transition"
              >
                <ShoppingBagIcon />
                <span className="ml-2">Start Shopping</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ITEM LIST */}
            <section className="lg:col-span-2 space-y-6">
              {items.map((item) => {
                const atMax = item.quantity >= (item.stock ?? Infinity);
                return (
                  <div
                    key={item.id}
                    className="flex items-center bg-white rounded-2xl shadow-md p-5 border border-[#ffcc29]/10 hover:shadow-xl transition-shadow"
                  >
                    {/* image */}
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0 border border-[#ffcc29]/30 bg-gradient-to-tr from-[#fffbe7] via-white to-[#fff6e3]">
                      <Image
                        src={item.image}
                        alt={item.title || 'Cart item'}
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    </div>
                    {/* info + controls */}
                    <div className="ml-6 flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mb-1">
                        ₹{item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-1 space-x-4">
                        {/* quantity buttons */}
                        <div className="flex items-center border border-[#ffcc29]/30 rounded-xl bg-[#fffde9]">
                          {/* minus */}
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1, item.stock)
                            }
                            className="px-3 py-1.5 text-lg font-bold text-gray-700 hover:bg-[#fff9f0] transition rounded-l-xl"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                            type="button"
                          >−</button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          {/* plus */}
                          <button
                            onClick={() => {
                              if (atMax) {
                                setToast('Stock limit reached');
                                return;
                              }
                              updateQuantity(item.id, item.quantity + 1, item.stock);
                            }}
                            className="px-3 py-1.5 text-lg font-bold text-gray-700 hover:bg-[#fff9f0] transition rounded-r-xl"
                            aria-label="Increase quantity"
                            disabled={atMax}
                            type="button"
                          >+</button>
                        </div>
                        {/* remove link */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#ed3237] text-xs font-semibold hover:underline ml-2"
                          aria-label="Remove item"
                          type="button"
                        >Remove</button>
                      </div>
                    </div>
                    {/* line total */}
                    <div className="font-bold text-xl text-[#ed3237] ml-6 text-right min-w-[90px]">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}

              {/* Customer details form */}
              <section className="bg-white p-7 rounded-2xl shadow-md border border-[#ffcc29]/20 mt-8">
                <h3 className="text-lg font-bold mb-5 text-[#ed3237]">Customer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input type="text" name="name" placeholder="Full Name *" value={customer.name}
                    onChange={handleInputChange} className="border border-[#ffcc29]/30 rounded-xl p-3 focus:ring-2 focus:ring-[#ed3237] transition text-gray-900"
                    autoComplete="name" required />
                  <input type="tel" name="phone" placeholder="Phone Number *" value={customer.phone}
                    onChange={handleInputChange} className="border border-[#ffcc29]/30 rounded-xl p-3 focus:ring-2 focus:ring-[#ed3237] transition text-gray-900"
                    autoComplete="tel" required />
                  <textarea name="address" placeholder="Delivery Address *" value={customer.address}
                    onChange={handleInputChange} className="md:col-span-2 border border-[#ffcc29]/30 rounded-xl p-3 focus:ring-2 focus:ring-[#ed3237] transition text-gray-900"
                    rows={3} autoComplete="street-address" required />
                  <select name="paymentMethod" value={customer.paymentMethod} onChange={handleInputChange}
                    className="md:col-span-2 border border-[#ffcc29]/30 rounded-xl p-3 focus:ring-2 focus:ring-[#ed3237] transition text-gray-900">
                    <option value="cash">Cash on Delivery</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>
              </section>
            </section>

            {/* Order Summary */}
            <aside className="bg-white p-7 rounded-2xl shadow-lg border border-[#ffcc29]/40 sticky top-24 self-start">
              <h3 className="text-lg font-bold mb-5 text-[#ed3237]">Order Summary</h3>
              <div className="flex justify-between mb-4">
                <span className="text-gray-700">Subtotal ({count} items)</span>
                <span className="font-bold text-[#ed3237]">₹{total.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout}
                className="w-full bg-gradient-to-tr from-[#ed3237] to-[#ffcc29] hover:from-[#ffcc29] hover:to-[#ed3237] text-white py-3 mt-3 rounded-xl font-bold shadow-md transition-transform active:scale-95"
                disabled={isRedirecting}
                type="button">
                {isRedirecting ? 'Redirecting...' : 'Proceed to Checkout'}
              </button>
              <button onClick={clearCart}
                className="w-full mt-4 border border-[#ed3237] text-[#ed3237] hover:bg-[#fff6e3] py-3 rounded-xl font-bold transition-colors"
                type="button">
                Clear Cart
              </button>
            </aside>
          </div>
        )}
        {/* Confirmation modal */}
        {showConfirm && (
          <ConfirmationModal
            onConfirm={confirmRedirect}
            onCancel={() => setShowConfirm(false)}
          />
        )}
        {/* Toast */}
        {toast && <Toast msg={toast} onDone={() => setToast('')} />}
      </div>
    </main>
  );
}
