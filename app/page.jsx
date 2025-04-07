// app/page.jsx
import PerformanceCarousel from '@/components/Carousel';
import CategoryCarousel from '@/components/CategoryCarousel';
import Header from '@/components/Header';
import PopularProducts from '@/components/PopularProducts';

export default function Home() {
  return (
    <main className="min-h-screen">

      <Header />
      {/* <Carousel /> */}
      <PerformanceCarousel/>
      {/* Hero Section */}
      <section className="relative bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Fresh Groceries Delivered Daily
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Get farm-fresh fruits, vegetables, and daily essentials at your doorstep
            </p>
          </div>
        </div>
      </section>

      {/* Category Carousel */}
      <CategoryCarousel />

      {/* Popular Products Grid */}
      <PopularProducts />

      {/* Quality Promise Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Our Quality Promise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Fast Delivery</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get your order delivered within 24 hours
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Quality Checked</h3>
                <p className="mt-2 text-base text-gray-500">
                  Every item goes through strict quality checks
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Easy Returns</h3>
                <p className="mt-2 text-base text-gray-500">
                  100% satisfaction guarantee or money back
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}