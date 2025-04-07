// app/category/[slug]/page.jsx
'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import { categories } from '@/data/categories';

export default function CategoryPage({ params }) {
  // Unwrap the promise using React.use()
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  // Filter products that match the selected category (based on the category field)
  const matchingProducts = products.filter(
    (product) => product.category === slug
  );

  // Filter products that do NOT match the selected category
  const otherProducts = products.filter(
    (product) => product.category !== slug
  );

  // Combine arrays: matching products appear first, then others
  const combinedProducts = [...matchingProducts, ...otherProducts];

  // Optionally, get category details from categories.js
  const categoryData = categories.find((cat) => cat.slug === slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {categoryData ? categoryData.name : slug.replace('-', ' ').toUpperCase()}
        </h1>
        {combinedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {combinedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="block relative h-48 w-full overflow-hidden"
                  aria-label={`View ${product.title}`}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    loading="lazy"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{product.title}</h3>
                  <span className="text-red-600 font-semibold">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
        <div className="mt-6 text-center">
          <Link
            href="/products"
            className="inline-block bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
