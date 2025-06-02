// app/category/[slug]/page.jsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';  // ✅ Add Header
import ProductModal from '@/components/ProductModal';
import products from '@/data/products';
import categories from '@/data/categories';
import { useCartStore } from '@/stores/cartStore';

export default function CategoryPage({ params }) {
  const { slug } = params;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const addToCart = useCartStore((state) => state.addItem);

  const matchingProducts = products.filter(
    (product) => product.category === slug
  );

  const categoryData = categories.find((cat) => cat.slug === slug);

  return (
    <>
      <Header />  {/* ✅ Consistent site header */}

      <ProductModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, qty, option) => {
          addToCart({ ...prod, quantity: qty, option });
          setSelectedProduct(null);
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {categoryData ? categoryData.name : slug.replace('-', ' ').toUpperCase()}
          </h1>

          {matchingProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {matchingProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <Link
                    href={`/products/${product.slug}`}
                    onClick={(e) => e.preventDefault()}
                    className="block relative h-48 w-full overflow-hidden"
                    aria-label={`View ${product.title}`}
                  >
                    <Image
                      src={product.image}
                      alt={product.title || 'Product image'}
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
                        ₹{product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
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
    </>
  );
}
