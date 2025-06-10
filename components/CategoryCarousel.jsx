'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Milk & Juice', image: '/categories/dairy.webp', slug: 'milk-juice' },
  { name: 'Personal Care', image: '/categories/care.webp', slug: 'personal-care' },
  { name: 'Vegetables', image: '/categories/vegetables.webp', slug: 'vegetables' },
  { name: 'Bakery', image: '/categories/bakery.webp', slug: 'bakery' },
  { name: 'Grains', image: '/categories/grains.webp', slug: 'grains' },
  { name: 'Chicken & Egg', image: '/categories/chicken.webp', slug: 'chicken' },
  { name: 'Fruits', image: '/categories/fruits.webp', slug: 'fruits' },
];

export default function CategoryCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Shop By Category
        </motion.h2>

        {/* Desktop & Tablet Grid */}
        <motion.div
          className="hidden md:grid grid-cols-3 lg:grid-cols-7 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {categories.map((category) => (
            <motion.div key={category.slug} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Link
                href={`/category/${category.slug}`}
                className="group block relative overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow"
                aria-label={`Shop ${category.name}`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  width={400}
                  height={300}
                  className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-yellow-400/30 flex items-center justify-center">
                  <h3 className="text-white text-lg font-semibold text-center">{category.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                className="flex-shrink-0 snap-start"
                style={{ width: 'calc(60% - 0.5rem)' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="group block relative overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow"
                  aria-label={`Shop ${category.name}`}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={300}
                    height={200}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-yellow-400/30 flex items-center justify-center">
                    <h3 className="text-white text-base font-semibold text-center">{category.name}</h3>
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
                className={`w-2 h-2 rounded-full ${
                  index === activeIndex ? 'bg-red-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => {
                  document.querySelectorAll('.snap-start')[index].scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                  });
                  setActiveIndex(index);
                }}
              />
            ))}
          </div>
        </div>

        {/* Featured Banner */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/category/fruits"
            className="group block relative overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow"
            aria-label="Shop Fruits"
          >
            <Image
              src="/categories/fruits-banner.jpg"
              alt="Fresh Fruits"
              width={1200}
              height={400}
              className="h-48 md:h-64 lg:h-80 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-yellow-400/30 flex items-center justify-center">
              <h3 className="text-white text-2xl md:text-3xl font-bold">Fresh Fruits</h3>
            </div>
          </Link>
          <Link
            href="/products"
            className="flex justify-center mt-4 text-red-600 hover:text-red-700 font-medium"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
