'use client';

import dynamic from 'next/dynamic';
import QuickLinks from '../components/QuickLinks'; // Import QuickLinks here
import DiscountBanner from './DiscountBanner';

const PerformanceCarousel = dynamic(() => import('./Carousel'), { loading: () => <div style={{ height: 200 }} /> });
const CategoryCarousel = dynamic(() => import('./CategoryCarousel'), { loading: () => <div style={{ height: 120 }} /> });
const PopularProducts = dynamic(() => import('./PopularProducts'), { loading: () => <div style={{ minHeight: 400 }} /> });
const Gallery = dynamic(() => import('./Gallery'), { loading: () => <div style={{ minHeight: 320 }} /> });

export default function HomeClient({ products }) {
  const features = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
      title: 'Fast Delivery',
      desc: 'Get your order delivered within 24 hours',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      title: 'Quality Checked',
      desc: 'Every item goes through strict quality checks',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      ),
      title: 'Easy Returns',
      desc: '100% satisfaction guarantee or money back',
    },
  ];

  return (
      <>
          
          <DiscountBanner/>
      {/* QuickLinks inserted here, above PerformanceCarousel */}
      <QuickLinks />

      {/* Fast dynamic load after first paint */}
      <PerformanceCarousel />
      <CategoryCarousel />

      {/* Hero Section: Instant HTML */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Fresh Groceries Delivered Daily
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Get farm-fresh fruits, vegetables, and daily essentials at your doorstep.
          </p>
        </div>
      </section>

      {/* Popular Products */}
      <section>
        <div className="max-w-7xl mx-auto px-4">
          <PopularProducts products={products} />
        </div>
      </section>

      {/* Quality Features & Gallery */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Quality Promise</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 hover:shadow-md transition-shadow rounded-lg"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white mx-auto mb-4">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 max-w-7xl mx-auto px-4">
          <h2 className="sr-only">Store Gallery</h2>
          <Gallery />
        </div>
      </section>
    </>
  );
}
