'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getOptimizedCloudinaryUrl } from './../app/lib/getOptimizedCloudinaryUrl';

const Slider = dynamic(() => import('react-slick'), { ssr: false });

const categories = [
  { name: 'Baby Care', image: 'https://res.cloudinary.com/your_cloud/image/upload/v.../baby_care.png', slug: 'baby-care' },
  { name: 'Beverages', image: 'https://res.cloudinary.com/your_cloud/image/upload/v.../beverages.jpg', slug: 'beverages' },
  { name: 'Condiments & Sauces', image: 'https://res.cloudinary.com/your_cloud/image/upload/v.../condiments.jpg', slug: 'condiments-sauces' },
  { name: 'Dairy & Refrigerated', image: 'https://res.cloudinary.com/your_cloud/image/upload/v.../dairy.png', slug: 'dairy-refrigerated' },
  { name: 'Household Cleaning', image: 'https://res.cloudinary.com/your_cloud/image/upload/v.../cleaning.jpg', slug: 'household-cleaning' },
  { name: 'Personal Care', image: 'https://res.cloudinary.com/your_cloud/image/upload/v.../care.jpg', slug: 'personal-care' },
  { name: 'Snacks & Bakery', image: 'https://res.cloudinary.com/your_cloud/image/upload/v.../snacks.jpg', slug: 'snacks-bakery' },
  { name: 'Spices & Masalas', image: 'https://res.cloudinary.com/your_cloud/image/upload/v.../spices.jpg', slug: 'spices-masalas' },
  { name: 'Staples', image: 'https://res.cloudinary.com/your_cloud/image/upload/v.../grains.jpg', slug: 'staples' },
];

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 800,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  pauseOnHover: true,
  swipeToSlide: true,
  cssEase: 'cubic-bezier(.67,.04,.37,.99)',
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 640, settings: { slidesToShow: 2 } },
  ],
};

export default function CategoryCarousel() {
  return (
    <section
      className="px-2 py-8 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-primary-50 to-gray-100"
      aria-labelledby="shop-categories-heading"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          id="shop-categories-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Shop By Category
        </motion.h2>

        {/* Desktop Grid */}
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
                aria-label={`Shop ${category.name}`}
                title={`Buy ${category.name} online`}
              >
                <Image
                  src={getOptimizedCloudinaryUrl(category.image)}
                  alt={`${category.name} – Buy online`}
                  width={400}
                  height={300}
                  className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-2xl"
                  sizes="(max-width: 1024px) 33vw, 14vw"
                  priority={idx === 0}
                  placeholder="blur"
                  blurDataURL="/images/logo.svg"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/40 to-secondary-400/30 flex items-center justify-center rounded-2xl">
                  <h3 className="text-white text-lg font-semibold text-center drop-shadow">{category.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden mt-2">
          <Slider {...sliderSettings}>
            {categories.map((category) => (
              <div key={category.slug} className="px-2">
                <Link
                  href={`/category/${category.slug}`}
                  className="block relative overflow-hidden rounded-xl shadow bg-white hover:shadow-md transition-shadow"
                >
                  <Image
                    src={getOptimizedCloudinaryUrl(category.image)}
                    alt={`${category.name} – Buy online`}
                    width={200}
                    height={120}
                    className="h-28 w-full object-cover rounded-t-xl transition-transform duration-300"
                    loading="lazy"
                    sizes="33vw"
                    placeholder="blur"
                    blurDataURL="/images/logo.svg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/35 to-secondary-400/20 flex items-center justify-center rounded-xl">
                    <h3 className="text-white text-sm font-medium text-center drop-shadow">{category.name}</h3>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>

        <Link
          href="/products"
          className="flex justify-center mt-8 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}
