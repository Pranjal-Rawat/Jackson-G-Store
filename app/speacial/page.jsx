'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import specialProducts from '../../data/specialProducts';

export default function SpecialProductsPage() {
  const [activeFestival, setActiveFestival] = useState('raksha-bandhan');

  const filteredProducts = specialProducts.filter(
    (p) => p.festival === activeFestival
  );

  const festivals = ['raksha-bandhan', 'diwali', 'christmas'];

  return (
    <main className="bg-white min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-pink-600 mb-6">
          🎉 Festival Specials 🎁
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          Browse exclusive festival products like Rakhi, Diwali sweets, and more.
          Free Home Delivery up to 5 km!
        </p>

        {/* Festival Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {festivals.map((festival) => (
            <button
              key={festival}
              onClick={() => setActiveFestival(festival)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition ${
                activeFestival === festival
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {festival.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4 text-center">
                  <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                  <p className="mt-1 text-pink-600 font-bold">₹{product.price}</p>
                  <Link
                    href={`/products/${product.id}`}
                    className="mt-3 inline-block px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No products found for {activeFestival}.
            </p>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
