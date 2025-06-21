'use client';

// Route: /components/PerformanceCarousel.jsx

import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// --- SEO-optimized carousel items (invisible text, only strong alt and ARIA) ---
const carouselItems = [
  {
    id: 1,
    title: "Fresh Vegetables Delivered in Dehradun",
    image: "/carousel/vegetables.jpg",
    link: "/category/vegetables",
    tag: "Farm-Fresh",
    description: "Order fresh vegetables online from Jackson Grocery Store. Best prices and same-day delivery in Dehradun.",
    alt: "Fresh vegetables online Dehradun – Jackson Grocery Store",
  },
  {
    id: 2,
    title: "Daily Essentials – Shop Groceries Online",
    image: "/carousel/essentials.jpg",
    link: "/category/essentials",
    tag: "Essentials",
    description: "Get all daily essentials and groceries online. Jackson Grocery Store is your one-stop shop in Dehradun.",
    alt: "Buy daily essentials online Dehradun – Jackson Grocery Store",
  },
  {
    id: 3,
    title: "Organic Fruits – Best Quality in Dehradun",
    image: "/carousel/fruits.jpg",
    link: "/category/fruits",
    tag: "Organic",
    description: "Premium organic fruits at the best prices. Delivered fresh in Dehradun by Jackson Grocery Store.",
    alt: "Organic fruits delivery Dehradun – Jackson Grocery Store",
  },
];

// Custom Arrow Components for Slick
function PrevArrow({ onClick }) {
  return (
    <button
      aria-label="Previous slide"
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary-600 hover:bg-primary-700 text-white p-2 shadow-lg focus:outline-none"
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
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary-600 hover:bg-primary-700 text-white p-2 shadow-lg focus:outline-none"
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
    customPaging: i => (
      <button
        className="h-3 w-3 bg-white/70 border border-primary-600 rounded-full focus:outline-none"
        type="button"
        tabIndex={0}
        aria-label={`Go to slide ${i + 1}`}
      />
    ),
  };

  return (
    <section
      className="w-full bg-gradient-to-br from-primary-50 to-gray-100 mt-10 shadow-lg"
      aria-label="Featured grocery categories and products"
    >
      <div className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-10">
        <div className="relative h-64 sm:h-80 md:h-[400px] lg:h-[440px]">
          <Slider {...settings}>
            {carouselItems.map((item) => (
              <div
                key={item.id}
                className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[440px]"
                itemScope
                itemType="https://schema.org/Product"
              >
                <Link
                  href={item.link}
                  aria-label={item.title}
                  tabIndex={0}
                  className="block h-full w-full group focus:outline-none"
                  itemProp="url"
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    priority
                    itemProp="image"
                  />
                  {/* Invisible SEO content for bots */}
                  <span className="sr-only" itemProp="name">{item.title}</span>
                  <span className="sr-only" itemProp="description">{item.description}</span>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      {/* Optionally add invisible navigation for SEO crawlability */}
      <nav aria-label="Featured grocery categories" className="sr-only">
        {carouselItems.map((item) => (
          <Link
            href={item.link}
            key={item.id}
            aria-label={item.title}
            tabIndex={-1}
            className="sr-only"
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </section>
  );
}
