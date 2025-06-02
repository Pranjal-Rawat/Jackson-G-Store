// components/PerformanceCarousel.jsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const carouselItems = [
  {
    id: 1,
    title: 'Fresh Vegetables',
    image: '', // Replace with valid image if possible
    link: '/category/vegetables'
  },
  {
    id: 2,
    title: 'Daily Essentials',
    image: '/carousel/essentials.jpg',
    link: '/category/essentials'
  },
  {
    id: 3,
    title: 'Organic Fruits',
    image: '/carousel/fruits.jpg',
    link: '/category/fruits'
  }
];

export default function PerformanceCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  return (
    <section className="relative overflow-hidden" aria-label="Featured products carousel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-96 md:h-[500px]">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Link
                href={carouselItems[currentIndex].link}
                className="block h-full"
                aria-label={`View ${carouselItems[currentIndex].title}`}
              >
                {carouselItems[currentIndex].image ? (
                  <Image
                    src={carouselItems[currentIndex].image}
                    alt={carouselItems[currentIndex].title}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    priority={currentIndex === 0}
                  />
                ) : (
                  <div className="flex items-center justify-center bg-gray-300 h-full w-full rounded-xl">
                    <span className="text-white text-xl">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
                    {carouselItems[currentIndex].title}
                  </h2>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center mt-6 space-x-4">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          <div className="flex space-x-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 rounded-full ${index === currentIndex ? 'bg-primary-500' : 'bg-gray-300'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}

// Chevron Icons
function ChevronLeftIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
