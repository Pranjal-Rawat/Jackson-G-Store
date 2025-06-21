'use client';

// Route: /components/PopularProducts.jsx – Popular products grid with add to cart

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';

export default function PopularProducts({ products }) {
  const addToCart = useCartStore((state) => state.addItem);
  const [visibleCount, setVisibleCount] = useState(10);

  // SEO: Add category/brand info if you have it in product object.
  const popularSorted = useMemo(() => {
    return [...products]
      .filter((p) => p.popular)
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  }, [products]);

  const visibleProducts = useMemo(() => {
    return popularSorted.slice(0, visibleCount);
  }, [popularSorted, visibleCount]);

  // Stable handlers with useCallback
  const handleAddToCart = useCallback((product, quantity = 1, option = null) => {
    addToCart({ ...product, quantity, option });
  }, [addToCart]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 10, popularSorted.length));
  }, [popularSorted.length]);

  // Single card with SEO attributes
  const ProductCard = ({ product, index }) => {
    const stock = product.stock ?? 0;
    const isOutOfStock = stock <= 0;

    return (
      <Link
        href={`/products/${product.slug}`}
        className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer group block focus:outline-none"
        aria-label={`View details of ${product.title} – Buy online at Jackson Grocery Store Dehradun`}
        tabIndex={0}
        itemScope
        itemType="https://schema.org/Product"
      >
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={product.image || '/images/logo.svg'}
            alt={`${product.title} – Buy at Jackson Grocery Store, Dehradun`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            // Only first image is priority, all others lazy
            {...(index === 0 ? { priority: true } : { loading: 'lazy' })}
            itemProp="image"
          />
          <meta itemProp="name" content={product.title} />
          <meta itemProp="sku" content={product.slug} />
          <meta itemProp="description" content={product.description || `Shop ${product.title} online in Dehradun`} />
          {isOutOfStock && (
            <span className="absolute top-2 right-2 z-10 bg-red-600 text-white px-2 py-0.5 rounded-full font-bold text-xs shadow">
              Out of Stock
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-1 truncate" itemProp="name">
            {product.title}
          </h3>
          <div className="flex justify-between items-center">
            <span
              className="text-red-600 font-semibold"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              ₹{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
              <meta itemProp="priceCurrency" content="INR" />
              <meta itemProp="price" content={typeof product.price === 'number' ? product.price.toFixed(2) : '0'} />
              <link itemProp="availability" href={isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"} />
            </span>
            <button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                if (!isOutOfStock) handleAddToCart(product);
              }}
              className={`bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors
                ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : ''}
              `}
              disabled={isOutOfStock}
              aria-label={isOutOfStock ? `Out of Stock` : `Add ${product.title} to cart`}
              type="button"
              tabIndex={isOutOfStock ? -1 : 0}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* SEO heading */}
        <h2 className="text-2xl font-bold mb-8">
          Popular Grocery Products in Dehradun
        </h2>
        {/* SEO copy for crawler */}
        <p className="text-gray-700 mb-4 max-w-2xl">
          Discover top-selling groceries, fruits, vegetables, and daily essentials. Shop the most popular products at Jackson Grocery Store, Dehradun for best prices and fast delivery.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleProducts.map((product, i) => (
            <ProductCard key={product._id || product.id} product={product} index={i} />
          ))}
        </div>
        {visibleCount < popularSorted.length && (
          <div className="py-8 text-center">
            <button
              onClick={handleLoadMore}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
              type="button"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
