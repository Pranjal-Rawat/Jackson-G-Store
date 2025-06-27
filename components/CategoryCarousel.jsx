'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getOptimizedCloudinaryUrl } from '../app/lib/getOptimizedCloudinaryUrl';

// Dynamic import for react-slick ONLY on client
const Slider = dynamic(() => import('react-slick'), { ssr: false });

const categories = [
  { name: 'Baby Care', slug: 'baby-care', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750831632/baby-312256_1280-removebg-preview_lufy4l.png' },
  { name: 'Beverages', slug: 'beverages', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750831775/six-pack-25200_1280_saedly.png' },
  { name: 'Condiments & Sauces', slug: 'condiments-sauces', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750833129/373eb1a8-7a46-411e-9efe-72b68aa1cfde.png-removebg-preview_jrxqpu.png' },
  { name: 'Dairy & Refrigerated', slug: 'dairy-refrigerated', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750833212/chicken-559892_1280_gq1qqv.png' },
  { name: 'Household Cleaning', slug: 'household-cleaning', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750833252/bucket-303265_1280_gc2kyy.png' },
  { name: 'Personal Care', slug: 'personal-care', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750833647/skin-7573077_1280_b8gueq.png' },
  { name: 'Snacks & Bakery', slug: 'snacks-bakery', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750835409/373eb1a8-7a46-411e-9efe-72b68aa1cfde.png__2_-removebg-preview_vemfxa.png' },
  { name: 'Spices & Masalas', slug: 'spices-masalas', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750834785/373eb1a8-7a46-411e-9efe-72b68aa1cfde.png__1_-removebg-preview_fg2ts2.png' },
  { name: 'Staples', slug: 'staples', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750835511/wheat-7847325_1280_obsdjy.png' },
  { name: 'Chocolates', slug: 'chocolates', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750873044/IMG_20250625_163427-removebg-preview_yetzt8.png' },
  { name: 'Stationary', slug: 'stationary', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750840100/stationary.png' },
  { name: 'Ice Creams', slug: 'ice-creams', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750840205/ice-cream.png' },
  { name: 'Perfumes', slug: 'perfumes', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750840250/perfume.png' },
  { name: 'Frozen Food', slug: 'frozen-food', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750840300/frozen-food.png' },
  { name: 'Noodles', slug: 'noodles', image: 'https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750840350/noodles.png' },
];

// 3 cards on all mobile/tablet breakpoints
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2400,
  pauseOnHover: true,
  swipeToSlide: true,
  cssEase: 'ease-in-out',
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 768,  settings: { slidesToShow: 3 } },
    { breakpoint: 480,  settings: { slidesToShow: 2 } },
  ],
};

export default function CategoryCarousel() {
  return (
    <section className="px-4 py-8 bg-gradient-to-br from-primary-50 to-gray-100" aria-labelledby="shop-categories-heading">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          id="shop-categories-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Shop By Category
        </motion.h2>

        {/* Desktop Grid (unchanged) */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-7 gap-5">
          {categories.map((category, idx) => (
            <motion.div key={category.slug} whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Link
                href={`/category/${category.slug}`}
                className="block rounded-xl shadow-md hover:shadow-xl transition-shadow bg-white overflow-hidden"
                aria-label={`Shop ${category.name}`}
              >
                <Image
                  src={getOptimizedCloudinaryUrl(category.image)}
                  alt={category.name}
                  width={400}
                  height={300}
                  className="w-full h-40 object-contain p-4"
                  sizes="(max-width: 1024px) 33vw, 14vw"
                  priority={idx < 3}
                  placeholder="blur"
                  blurDataURL="/images/logo.svg"
                />
                <div className="text-center py-2 font-medium text-sm text-gray-700">
                  {category.name}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel: 3 cards always visible */}
        <div className="md:hidden mt-4">
          <Slider {...sliderSettings}>
            {categories.map((category) => (
              <div key={category.slug} className="px-2">
                <Link
                  href={`/category/${category.slug}`}
                  className="block rounded-xl bg-white shadow-md hover:shadow-xl overflow-hidden transition-shadow"
                  aria-label={`Shop ${category.name}`}
                >
                  <Image
                    src={getOptimizedCloudinaryUrl(category.image)}
                    alt={category.name}
                    width={300}
                    height={200}
                    className="w-full h-32 object-contain p-4"
                    loading="lazy"
                    sizes="33vw"
                    placeholder="blur"
                    blurDataURL="/images/logo.svg"
                  />
                  <div className="text-center py-2 text-sm font-medium text-gray-700">
                    {category.name}
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white bg-primary-600 hover:bg-primary-700 hover:scale-105 transition-all shadow-lg group font-semibold"
          >
            View All Products
            <span className="inline-block transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
