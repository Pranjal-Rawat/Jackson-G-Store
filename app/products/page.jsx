// app/products/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import { useCartStore } from '../../stores/cartStore';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [localQuery, setLocalQuery] = useState('');

  useEffect(() => {
    setLocalQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(localQuery.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    const query = localQuery.trim();
    const newUrl = query ? `/products?q=${encodeURIComponent(query)}` : '/products';
    window.history.replaceState(null, '', newUrl);
  };

  // Dedicated handler to add a product to the cart
  const handleAddToCart = (product) => {
    useCartStore.getState().addItem(product);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="absolute right-3 top-3 text-gray-500 hover:text-red-600"
                aria-label="Search"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {localQuery && (
            <p className="text-center mt-4 text-gray-600">
              Showing results for "{localQuery}"
            </p>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                      aria-label={`Add ${product.title} to cart`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found matching your search.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-block bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}