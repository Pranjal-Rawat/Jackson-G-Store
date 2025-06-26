'use client';

import { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import { FiMenu, FiSearch, FiShoppingCart, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../stores/cartStore';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';
import categories from '../data/categories';      // ← adjust if path is different

/* -------------------------------------------------------------------------- */
/*                               HEADER COMPONENT                             */
/* -------------------------------------------------------------------------- */
export default function Header() {
  const router       = useRouter();
  const cartCount    = useCartStore((s) => s.count);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catOpen,     setCatOpen]     = useState(false);   // ⬅️ category accordion

  /* lock body scroll when sidebar open */
  useLayoutEffect(() => {
    if (sidebarOpen) {
      const sb = window.innerWidth - document.documentElement.clientWidth;
      Object.assign(document.body.style, { overflow: 'hidden', paddingRight: sb ? `${sb}px` : '' });
    } else {
      Object.assign(document.body.style, { overflow: '', paddingRight: '' });
    }
    return () => Object.assign(document.body.style, { overflow: '', paddingRight: '' });
  }, [sidebarOpen]);

  const open  = useCallback(() => setSidebarOpen(true), []);
  const close = useCallback(() => { setSidebarOpen(false); setCatOpen(false); }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 shadow-md">
      {/* ---------- TOP BAR ---------- */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-500">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">

          {/* Logo + burger */}
          <div className="flex items-center gap-2">
            <button
              onClick={open}
              aria-label="Open menu"
              className="rounded-lg p-2 text-white hover:bg-white/10 active:scale-95 transition md:hidden"
              type="button"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            <Link href="/" aria-label="Jackson Grocery Store home" className="flex items-center">
              <Image
                src="https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png"
                alt="Jackson Grocery Store logo"
                width={140}
                height={46}
                className="h-10 w-auto transition-transform hover:-rotate-2 active:scale-95"
                priority
                onError={(e) => (e.currentTarget.src = '/images/logo.svg')}
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-5">
            {['Home', 'About', 'Gallery', 'FAQ', 'Contact'].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase() === 'home' ? '' : label.toLowerCase()}`}
                className="relative py-2 text-sm font-medium text-white
                           before:absolute before:bottom-0 before:left-1/2 before:h-[2px] before:w-0
                           before:-translate-x-1/2 before:rounded-full before:bg-yellow-300
                           before:transition-all hover:before:w-full"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Cart icon */}
          <Link
            href="/cart"
            aria-label="View cart"
            className="relative rounded-full p-2 text-white hover:bg-white/10 active:scale-95 transition"
          >
            <FiShoppingCart className="h-6 w-6" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center
                             justify-center rounded-full bg-red-600 text-[11px] font-bold text-white shadow"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>

      {/* ---------- SEARCH STRIP ---------- */}
      <div className="border-t border-gray-200 bg-white shadow-inner">
        <div className="mx-auto max-w-4xl px-2 py-2">
          <SearchBar />
        </div>
      </div>

      {/* ---------- MOBILE SIDEBAR ---------- */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[90vw] flex-col bg-white shadow-2xl"
            >
              {/* header */}
              <div className="flex items-center justify-between border-b px-5 py-4">
                <span className="text-lg font-bold text-primary-600">Quick Links</span>
                <button onClick={close} aria-label="Close menu" className="rounded-full p-2 hover:bg-gray-100">
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              {/* links */}
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                {['Home', 'About', 'Gallery', 'FAQ', 'Contact'].map((l) => (
                  <Link
                    key={l}
                    href={`/${l.toLowerCase() === 'home' ? '' : l.toLowerCase()}`}
                    onClick={close}
                    className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-primary-50"
                  >
                    {l}
                  </Link>
                ))}

                {/* --- Categories accordion --- */}
                <button
                  type="button"
                  aria-expanded={catOpen}
                  onClick={() => setCatOpen((p) => !p)}
                  className="mt-4 flex w-full items-center justify-between rounded-lg px-4 py-3
                             text-base font-semibold text-gray-800 hover:bg-primary-50"
                >
                  Shop Categories
                  <span className={`transition-transform ${catOpen ? 'rotate-90' : ''}`}>›</span>
                </button>

                <AnimatePresence initial={false}>
                  {catOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-2"
                    >
                      {categories.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/category/${c.slug}`}
                            onClick={close}
                            className="block rounded-lg px-5 py-2 text-sm text-gray-700 hover:bg-primary-50"
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 SEARCH BAR                                 */
/* -------------------------------------------------------------------------- */
function SearchBar() {
  const router               = useRouter();
  const [query, setQuery]    = useState('');
  const [debounced]          = useDebounce(query, 250);
  const [suggest, setSuggest] = useState([]);
  const [show, setShow]      = useState(false);

  // fetch suggestions
  useEffect(() => {
    let cancel = false;
    if (debounced.length > 2) {
      fetch(`/api/search?q=${encodeURIComponent(debounced)}`)
        .then((r) => r.json())
        .then((d) => !cancel && (setSuggest(d), setShow(true)))
        .catch(() => setSuggest([]));
    } else {
      setSuggest([]);
      setShow(false);
    }
    return () => { cancel = true; };
  }, [debounced]);

  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      setShow(false);
    }
  };

  return (
    <form onSubmit={submit} className="relative w-full" role="search" autoComplete="off">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => suggest.length && setShow(true)}
        onBlur={() => requestAnimationFrame(() => setShow(false))}
        placeholder="Search groceries, brands, products..."
        className="w-full rounded-full border border-gray-300 bg-white px-11 py-2 text-base shadow-sm
                   focus:border-primary-500 focus:ring-2 focus:ring-primary-400"
      />
      <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

      {/* suggestions */}
      <AnimatePresence>
        {show && (
          suggest.length ? (
            <motion.ul
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto
                         rounded-lg border border-gray-200 bg-white shadow-lg"
            >
              {suggest.map((s) => (
                <li key={s._id} className="border-b last:border-none">
                  <Link
                    href={`/products/${s.slug || s._id}`}
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary-50"
                  >
                    <Image src={s.image || '/images/logo.svg'} alt={s.title} width={32} height={32} className="rounded shadow" />
                    {s.title}
                  </Link>
                </li>
              ))}
            </motion.ul>
          ) : debounced.length > 2 ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-gray-200
                         bg-white px-4 py-2 text-sm text-gray-500 shadow-lg"
            >
              No results found.
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </form>
  );
}
