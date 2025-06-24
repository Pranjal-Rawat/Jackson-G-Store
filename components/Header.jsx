'use client';

import { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { FiMenu, FiSearch, FiShoppingCart, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../stores/cartStore';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const cartCount = useCartStore((state) => state.count);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useLayoutEffect(() => {
    if (sidebarOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [sidebarOpen]);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg bg-white border border-gray-200 shadow md:hidden"
            aria-label="Open menu"
            onClick={openSidebar}
            type="button"
          >
            <FiMenu className="h-6 w-6 text-gray-700" />
          </button>
          <Link href="/" aria-label="Jackson Grocery Store Home">
            <Image
              src="https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png"
              alt="Jackson Grocery Store logo"
              width={140}
              height={46}
              className="h-11 w-auto"
              priority
              onError={(e) => {
                e.currentTarget.src = '/images/logo.svg';
              }}
            />
          </Link>
        </div>

        <nav className="hidden md:flex gap-3">
          {['Home', 'About', 'Gallery', 'FAQ', 'Contact'].map((label) => (
            <Link
              key={label}
              href={`/${label.toLowerCase() === 'home' ? '' : label.toLowerCase()}`}
              aria-label={label}
              className="text-gray-700 hover:text-red-600 px-3 py-2 font-medium"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link href="/cart" aria-label="View cart" className="p-2 text-gray-700 hover:text-red-600 relative">
          <FiShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <div className="w-full bg-gray-50 border-t border-gray-200 shadow-sm px-2">
        <div className="max-w-4xl mx-auto py-2 flex items-center">
          <SearchBar />
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={closeSidebar}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 40 }}
              className="fixed top-0 left-0 bottom-0 w-72 max-w-[90vw] bg-white shadow-2xl z-[60] flex flex-col"
              style={{ minHeight: '100dvh' }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <span className="text-lg font-bold text-red-600">Quick Links</span>
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close menu"
                  onClick={closeSidebar}
                  type="button"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-2">
                {['Home', 'About', 'Gallery', 'FAQ', 'Contact'].map((label) => (
                  <Link
                    key={label}
                    href={`/${label.toLowerCase() === 'home' ? '' : label.toLowerCase()}`}
                    className="block px-5 py-3 text-base text-gray-800 hover:bg-red-50"
                    onClick={closeSidebar}
                    aria-label={label}
                  >
                    {label}
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

// --- SearchBar component ---
function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 250);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    let ignore = false;
    if (debouncedQuery.length > 2) {
      fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          if (!ignore) {
            setSearchSuggestions(data);
            setShowSuggestions(true);
          }
        })
        .catch(() => setSearchSuggestions([]));
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
    return () => { ignore = true; };
  }, [debouncedQuery]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, router]);

  const handleBlur = useCallback(() => {
    requestAnimationFrame(() => setShowSuggestions(false));
  }, []);

  return (
    <form onSubmit={handleSearch} className="w-full" autoComplete="off" role="search">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for groceries, brands, products in Dehradun..."
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-base shadow-sm bg-white"
          aria-label="Search products"
          onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
          onBlur={handleBlur}
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <AnimatePresence>
          {showSuggestions && searchSuggestions.length > 0 && (
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
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-red-100"
                  >
                    <Image
                      src={suggestion.image || '/images/logo.svg'}
                      alt={suggestion.title}
                      width={32}
                      height={32}
                      className="rounded shadow"
                    />
                    <span>{suggestion.title}</span>
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
          {showSuggestions && searchSuggestions.length === 0 && searchQuery.length > 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50 border border-gray-200 px-4 py-2 text-gray-500"
            >
              No results found.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
