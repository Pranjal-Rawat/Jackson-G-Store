// components/Header.jsx
'use client';

import { useState, useEffect } from 'react';
import { FiMenu, FiSearch, FiShoppingCart } from 'react-icons/fi';
import { Menu, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';
import categories from '@/data/categories'; // Direct import

export default function Header() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery] = useDebounce(searchQuery, 300);
    const cartCount = useCartStore((state) => state.count);
    const [searchSuggestions, setSearchSuggestions] = useState([]);

    useEffect(() => {
        if (debouncedQuery.length > 2) {
            fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`)
                .then((res) => res.json())
                .then(setSearchSuggestions)
                .catch(() => setSearchSuggestions([]));
        } else {
            setSearchSuggestions([]);
        }
    }, [debouncedQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 bg-white shadow-sm"
        >
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:bg-white focus:p-4 focus:rounded-lg focus:shadow-lg"
            >
                Skip to main content
            </a>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Section */}
                    <div className="flex items-center flex-1">
                        <Link href="/" className="shrink-0" aria-label="Home">
                            <Image
                                src="/images/logo.svg"
                                alt="Grocery Store Logo"
                                width={120}
                                height={40}
                                className="h-10 w-auto"
                                priority
                            />
                        </Link>

                        <Menu as="div" className="relative ml-6">
                            <Menu.Button
                                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
                                aria-label="Categories menu"
                            >
                                <FiMenu className="h-6 w-6" />
                                <span className="hidden md:inline font-medium">Categories</span>
                            </Menu.Button>

                            <Transition
                                as={motion.div}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute left-0 w-56 mt-2 origin-top-left bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                            >
                                <Menu.Items>
                                    {categories.map((category) => (
                                        <Menu.Item key={category.slug}>
                                            {({ active }) => (
                                                <Link
                                                    href={`/category/${category.slug}`}
                                                    className={`${active ? 'bg-yellow-100' : ''} flex items-center px-4 py-2 text-gray-700 hover:bg-yellow-100 transition-colors`}
                                                >
                                                    <Image
                                                        src={category.image}
                                                        alt={category.name}
                                                        width={32}
                                                        height={32}
                                                        className="h-8 w-8 object-cover mr-2 rounded"
                                                    />
                                                    {category.name}
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>

                    {/* Search Section */}
                    <div className="flex-1 max-w-2xl mx-8 relative">
                        <form onSubmit={handleSearch} role="search">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    aria-label="Search products"
                                />
                
                                <AnimatePresence>
                                    {searchSuggestions.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-50"
                                        >
                                            {searchSuggestions.map((suggestion) => (
                                                <Link
                                                    key={suggestion.slug}
                                                    href={`/products/${suggestion.slug}`}
                                                    className="block px-4 py-2 text-gray-700 hover:bg-yellow-100 transition-colors"
                                                    onClick={() => setSearchQuery('')}
                                                >
                                                    {suggestion.title}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </form>
                    </div>

                    {/* Cart Section */}
                    <div className="flex items-center justify-end flex-1">
                        <Link
                            href="/cart"
                            className="p-2 text-gray-700 hover:text-red-600 relative transition-colors"
                            aria-label="View cart"
                        >
                            <FiShoppingCart className="h-6 w-6" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}