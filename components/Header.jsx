'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import { FiMenu, FiSearch, FiShoppingCart, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';
import categories from '@/data/categories';

export default function Header() {
  const router = useRouter();
  const cartCount = useCartStore((state) => state.count);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- FIX for "padding on right" when sidebar is open ---
  useLayoutEffect(() => {
    if (sidebarOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [sidebarOpen]);
  // ------------------------------------------------------

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg border-b border-gray-100">
      {/* Top Nav */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          {/* Menu button for mobile */}
          <button
            className="p-2 rounded-lg bg-white border border-gray-200 shadow md:hidden focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Open categories menu"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="h-6 w-6 text-gray-700" />
          </button>
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Home">
            <Image
              src="/images/logo.svg"
              alt="Grocery Store Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>
        {/* Categories for desktop */}
        <div className="hidden md:flex gap-2">
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg transition-colors font-medium"
            >
              {category.name}
            </Link>
          ))}
          <div className="relative group">
            <button
              className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg font-medium transition-colors"
            >
              More
            </button>
            <div className="absolute left-0 mt-2 min-w-[180px] bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-opacity z-50">
              {categories.slice(5).map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* Cart */}
        <Link
          href="/cart"
          className="p-2 text-gray-700 hover:text-red-600 relative transition-colors"
          aria-label="View cart"
        >
          <FiShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shadow">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
      {/* Sticky Search Bar */}
      <div className="w-full bg-gray-50 border-t border-gray-200 shadow-sm px-2">
        <div className="max-w-4xl mx-auto py-2 flex items-center relative">
          <SearchBar />
        </div>
      </div>
      {/* Sidebar for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 40 }}
              className="fixed top-0 left-0 bottom-0 w-72 max-w-[90vw] bg-white shadow-2xl z-[60] flex flex-col"
              style={{ minHeight: '100dvh' }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <span className="text-lg font-bold text-red-600">Categories</span>
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close categories menu"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="flex items-center gap-3 px-5 py-3 text-base rounded-lg text-gray-800 hover:bg-red-50 transition-colors"
                    aria-label={`Shop ${category.name}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-cover rounded shadow border border-gray-100"
                    />
                    <span className="font-medium">{category.name}</span>
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

// --- SearchBar as its own component ---
function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        .then((res) => res.json())
        .then(setSearchSuggestions)
        .catch(() => setSearchSuggestions([]));
    } else {
      setSearchSuggestions([]);
    }
  }, [debouncedQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchSuggestions([]);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full" autoComplete="off">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for groceries, brands, products..."
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base bg-white shadow-sm"
          aria-label="Search products"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <AnimatePresence>
          {searchSuggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 border border-gray-200 max-h-64 overflow-y-auto"
            >
              {searchSuggestions.map((suggestion) => (
                <li key={suggestion._id} className="border-b last:border-none">
                  <Link
                    href={`/products/${suggestion.slug || suggestion._id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors"
                    onClick={() => setSearchQuery('')}
                  >
                    {suggestion['Product Name'] || suggestion.title || 'No Title'}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
