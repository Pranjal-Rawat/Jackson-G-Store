'use client';

// Route: /components/Carousel.jsx – Hero/featured products carousel

import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Marketing carousel items (replace with your actual data)
const carouselItems = [
  {
    id: 1,
    title: "Fresh Vegetables",
    image: "/carousel/vegetables.jpg",
    link: "/category/vegetables",
    tag: "Fresh",
  },
  {
    id: 2,
    title: "Daily Essentials",
    image: "/carousel/essentials.jpg",
    link: "/category/essentials",
    tag: "Essentials",
  },
  {
    id: 3,
    title: "Organic Fruits",
    image: "/carousel/fruits.jpg",
    link: "/category/fruits",
    tag: "Organic",
  },
];

// Custom Arrow Components for Slick
function PrevArrow({ className, style, onClick }) {
  return (
    <button
      aria-label="Previous slide"
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-primary-600 hover:bg-primary-700 text-white p-2 shadow-lg focus:outline-none"
      style={{ ...style }}
      onClick={onClick}
      type="button"
      tabIndex={0}
    >
      <FiChevronLeft className="h-7 w-7" />
    </button>
  );
}
function NextArrow({ className, style, onClick }) {
  return (
    <button
      aria-label="Next slide"
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-primary-600 hover:bg-primary-700 text-white p-2 shadow-lg focus:outline-none"
      style={{ ...style }}
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
      aria-label="Featured products carousel"
    >
      <div className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-10">
        <div className="relative h-64 sm:h-80 md:h-[400px] lg:h-[440px]">
          <Slider {...settings}>
            {carouselItems.map((item) => (
              <div key={item.id} className="relative w-full h-64 sm:h-80 md:h-[400px] lg:h-[440px]">
                <Link
                  href={item.link}
                  className="block h-full w-full group focus:outline-none"
                  aria-label={`View ${item.title}`}
                  tabIndex={0}
                >
                  {/* Image */}
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover w-full h-full"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      priority
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-gray-300 h-full w-full">
                      <span className="text-white text-xl">No Image</span>
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 flex items-end md:items-center justify-center">
                    <div className="w-full md:w-auto px-6 py-6 md:py-10 flex flex-col items-center gap-3">
                      <span className="inline-block px-3 py-1 bg-primary-600/90 text-white text-xs md:text-sm rounded-full uppercase tracking-wide shadow font-semibold mb-1 animate-bounce">
                        {item.tag}
                      </span>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg mb-2 tracking-tight">
                        {item.title}
                      </h2>
                      <span className="block text-white/90 font-medium text-base md:text-lg text-center">
                        Shop fresh, organic, and daily needs right at your doorstep!
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
