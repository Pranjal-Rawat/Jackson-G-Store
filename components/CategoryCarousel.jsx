// components/CategoryCarousel.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
    { name: 'Milk & Juice', image: '/categories/dairy.webp', slug: 'milk-juice' },
    { name: 'Personal Care', image: '/categories/care.webp', slug: 'personal-care' },
    { name: 'Vegetables', image: '/categories/vegetables.webp', slug: 'vegetables' },
    { name: 'Bakery', image: '/categories/bakery.webp', slug: 'bakery' },
    { name: 'Grains', image: '/categories/grains.webp', slug: 'grains' },
    { name: 'Chicken & Egg', image: '/categories/chicken.webp', slug: 'chicken' },
    { name: 'Fruits', image: '/categories/fruits.webp', slug: 'fruits' }
];

export default function CategoryCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Animation variants for fade-in effect
    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    className="text-2xl font-bold mb-6 bg-gradient-to-br from-yellow-400 to-red-500 p-6 text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Shop By Category
                </motion.h2>

                {/* Desktop & Tablet Grid */}
                <motion.div
                    className="hidden md:grid md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-8 gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    {categories.map((category) => (
                        <motion.div key={category.slug} variants={itemVariants}>
                            <Link
                                href={`/category/${category.slug}`}
                                className="group relative block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                aria-label={`Shop ${category.name}`}
                            >
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    width={400}
                                    height={300}
                                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-orange-400 text-white bg-opacity-40 flex items-center justify-center">
                                    <h3 className="text-white text-lg font-medium text-center px-2">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mobile Carousel */}
                <div className="md:hidden relative">
                    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.slug}
                                className="flex-shrink-0 mx-1 snap-start"
                                style={{ width: 'calc(50% - 0.5rem)' }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Link
                                    href={`/category/${category.slug}`}
                                    className="group relative block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                    aria-label={`Shop ${category.name}`}
                                >
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        width={300}
                                        height={200}
                                        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 p-6 text-white bg-opacity-40 flex items-center justify-center">
                                        <h3 className="text-white text-base font-medium text-center px-2">
                                            {category.name}
                                        </h3>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Scroll Indicators */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {categories.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full ${index === activeIndex ? 'bg-red-600' : 'bg-yellow-300'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                                onClick={() => {
                                    document.querySelectorAll('.snap-start')[index].scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'nearest',
                                        inline: 'center'
                                    });
                                    setActiveIndex(index);
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Featured Fruits Section */}
                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Link
                        href="/category/fruits"
                        className="group relative block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        aria-label="Shop Fruits"
                    >
                        <Image
                            src="/categories/fruits-banner.jpg"
                            alt="Fresh Fruits"
                            width={1200}
                            height={400}
                            className="h-48 w-full object-cover md:h-64 lg:h-80 transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-red-300 via-orange-400 to-yellow-500 p-6 text-white bg-opacity-20 flex items-center justify-center">
                            <h3 className="text-white text-2xl md:text-3xl font-bold">
                                Fresh Fruits
                            </h3>
                        </div>
                    </Link>
                    <Link
                        href="/products"
                        className="flex justify-center inline-block mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        More...
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}