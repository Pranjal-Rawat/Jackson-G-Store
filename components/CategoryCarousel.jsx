'use client';

// Route: /components/CategoryCarousel.jsx – Category grid/carousel for browsing

import React from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// SEO-optimized categories
const categories = [
  { name: 'Baby Care', image: '/categories/baby_care.webp', slug: 'baby-care' },
  { name: 'Beverages', image: '/categories/beverages.webp', slug: 'beverages' },
  { name: 'Condiments & Sauces', image: '/categories/condiments_sauces.webp', slug: 'condiments-sauces' },
  { name: 'Dairy & Refrigerated', image: '/categories/dairy_refrigerated.webp', slug: 'dairy-refrigerated' },
  { name: 'Household Cleaning', image: '/categories/household_cleaning.webp', slug: 'household-cleaning' },
  { name: 'Personal Care', image: '/categories/care.webp', slug: 'personal-care' },
  { name: 'Snacks & Bakery', image: '/categories/snacks_bakery.webp', slug: 'snacks-bakery' },
  { name: 'Spices & Masalas', image: '/categories/spices_masalas.webp', slug: 'spices-masalas' },
  { name: 'Staples', image: '/categories/grains.webp', slug: 'staples' },
];

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 1000,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  pauseOnHover: true,
  swipeToSlide: true,
  cssEase: 'cubic-bezier(.67,.04,.37,.99)',
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 640, settings: { slidesToShow: 3 } },
  ],
};

export default function CategoryCarousel() {
  return (
    <section className="px-2 py-8 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Shop By Category
        </motion.h2>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-7 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category.slug}
              whileHover={{ scale: 1.06, boxShadow: '0 8px 24px rgba(50,50,100,0.12)' }}
              className="focus-within:scale-105"
            >
              <Link
                href={`/category/${category.slug}`}
                className="group block relative overflow-hidden rounded-2xl shadow bg-white hover:shadow-lg transition-shadow focus:outline-none"
                aria-label={`Shop ${category.name} – Jackson Grocery Store Dehradun`}
                title={`Buy ${category.name} online in Dehradun`}
                tabIndex={0}
              >
                <Image
                  src={category.image}
                  alt={`${category.name} – Grocery Store Dehradun – Buy online`}
                  width={400}
                  height={300}
                  className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-2xl"
                  sizes="(max-width: 1024px) 33vw, 14vw"
                  // SEO/performance fix: Only first image uses priority, rest are lazy
                  {...(idx === 0 ? { priority: true } : { loading: "lazy" })}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/40 to-secondary-400/30 flex items-center justify-center rounded-2xl">
                  <h3 className="text-white text-lg font-semibold text-center drop-shadow">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden mt-2">
          <Slider {...sliderSettings}>
            {categories.map((category) => (
              <div key={category.slug} className="px-2">
                <Link
                  href={`/category/${category.slug}`}
                  className="block relative overflow-hidden rounded-xl shadow bg-white hover:shadow-md transition-shadow focus:outline-none"
                  aria-label={`Shop ${category.name} – Jackson Grocery Store Dehradun`}
                  title={`Buy ${category.name} online in Dehradun`}
                  tabIndex={0}
                >
                  <Image
                    src={category.image}
                    alt={`${category.name} – Grocery Store Dehradun – Buy online`}
                    width={200}
                    height={120}
                    className="h-28 w-full object-cover rounded-t-xl transition-transform duration-300"
                    loading="lazy"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/35 to-secondary-400/20 flex items-center justify-center rounded-xl">
                    <h3 className="text-white text-sm font-medium text-center drop-shadow">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>

        {/* SEO crawlable link */}
        <Link
          href="/products"
          className="flex justify-center mt-8 text-primary-600 hover:text-primary-700 font-semibold transition-colors focus:outline-none"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}
