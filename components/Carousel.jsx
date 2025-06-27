'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Dynamically load react-slick ONLY client-side
const Slider = dynamic(() => import('react-slick'), { ssr: false });

const carouselItems = [
  {
    id: 1,
    title: "Fresh Vegetables Delivered in Dehradun",
    image: "https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750871098/IMG_20250625_164517_plac1o.jpg",
    link: "/category/vegetables",
    tag: "Farm-Fresh",
    description: "Order fresh vegetables online from Jackson Grocery Store. Best prices and same-day delivery in Dehradun.",
    alt: "Fresh vegetables online Dehradun – Jackson Grocery Store",
  },
  {
    id: 2,
    title: "Daily Essentials – Shop Groceries Online",
    image: "https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750873709/WhatsApp_Image_2025-06-25_at_23.18.03_ef934c90_aqum8z.jpg",
    link: "/category/essentials",
    tag: "Essentials",
    description: "Get all daily essentials and groceries online. Jackson Grocery Store is your one-stop shop in Dehradun.",
    alt: "Buy daily essentials online Dehradun – Jackson Grocery Store",
  },
  {
    id: 3,
    title: "Organic Fruits – Best Quality in Dehradun",
    image: "https://res.cloudinary.com/dnp4yuy8z/image/upload/v1750871291/IMG_20250625_163427_xep91s.jpg",
    link: "/category/fruits",
    tag: "Organic",
    description: "Premium organic fruits at the best prices. Delivered fresh in Dehradun by Jackson Grocery Store.",
    alt: "Organic fruits delivery Dehradun – Jackson Grocery Store",
  },
];

function PrevArrow({ onClick }) {
  return (
    <button
      aria-label="Previous slide"
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg focus:outline-none"
      onClick={onClick}
      type="button"
      tabIndex={0}
    >
      <FiChevronLeft className="h-7 w-7" />
    </button>
  );
}

function NextArrow({ onClick }) {
  return (
    <button
      aria-label="Next slide"
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg focus:outline-none"
      onClick={onClick}
      type="button"
      tabIndex={0}
    >
      <FiChevronRight className="h-7 w-7" />
    </button>
  );
}

export default function PerformanceCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: dots => (
      <div>
        <ul className="flex justify-center items-center mt-4 space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <button
        className="h-3 w-3 bg-white/80 border border-primary-600 rounded-full focus:outline-none"
        type="button"
        tabIndex={0}
      />
    ),
    swipeToSlide: true,
    pauseOnHover: true,
  };

  return (
    <section
      className="w-full bg-gradient-to-br from-primary-50 to-gray-100 mt-10 shadow-md"
      aria-label="Featured grocery categories and products"
    >
      <div className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-10">
        <div className="relative h-64 sm:h-80 md:h-[400px] lg:h-[440px]">
          <Slider {...settings}>
            {carouselItems.map((item, idx) => (
              <div
                key={item.id}
                className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[440px]"
                itemScope
                itemType="https://schema.org/Product"
              >
                <Link
                  href={item.link}
                  aria-label={item.title}
                  className="block h-full w-full group focus:outline-none"
                  tabIndex={0}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover w-full h-full rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    priority={idx === 0}
                    placeholder="blur"
                    blurDataURL="/images/logo.svg"
                    itemProp="image"
                  />
                  {/* Gradient overlay for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10 pointer-events-none" />
                  <span className="sr-only" itemProp="name">{item.title}</span>
                  <span className="sr-only" itemProp="description">{item.description}</span>
                  <meta itemProp="url" content={item.link} />
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {/* Crawlable hidden nav links for SEO bots */}
      <nav aria-label="Featured grocery categories" className="sr-only">
        {carouselItems.map((item) => (
          <Link key={item.id} href={item.link} aria-label={item.title} tabIndex={-1}>
            {item.title}
          </Link>
        ))}
      </nav>
    </section>
  );
}
