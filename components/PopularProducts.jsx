'use client';

// Route: /components/PopularProducts.jsx – Popular products grid with badges, unit, pcs, MRP, offer price

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';

export default function PopularProducts({ products }) {
  const addToCart = useCartStore((state) => state.addItem);
  const [visibleCount, setVisibleCount] = useState(10);

  // Filter and sort for popular and by rank
  const popularSorted = useMemo(() => {
    return [...products]
      .filter((p) => p.popular === true || p.popular === 'true')
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
    const unit = product.unit || product.quantity || '';
    const pcs = product.pcs || product.pieces || '';
    const rank = product.rank;
    const isPopular = product.popular === true || product.popular === 'true';
    const price = typeof product.price === 'number' ? product.price : parseFloat(product.price || 0);
    const mrp = typeof product.mrp === 'number' ? product.mrp : parseFloat(product.mrp || 0);

    return (
      <Link
        href={`/products/${product.slug}`}
        className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer group block focus:outline-none relative"
        aria-label={`View details of ${product.title} – Buy online at Jackson Grocery Store Dehradun`}
        tabIndex={0}
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {typeof rank === "number" && (
            <span className="bg-[#ffcc29] text-[#ed3237] px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm border border-[#ffe58a]">
              Rank #{rank}
            </span>
          )}
          {isPopular && (
            <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm border border-red-300">
              ★ Popular
            </span>
          )}
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={product.image || '/images/logo.svg'}
            alt={`${product.title} – Buy at Jackson Grocery Store, Dehradun`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
          {/* Unit/Quantity */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {unit && (
              <span className="text-xs text-gray-500 font-medium">{unit}</span>
            )}
            {pcs && (
              <span className="text-xs text-gray-500 font-medium">{pcs} pcs</span>
            )}
          </div>
          {/* Price & MRP */}
          <div className="flex items-center gap-2 mb-1">
            {mrp > price && mrp > 0 && (
              <span className="text-xs text-gray-400 line-through">₹{mrp.toFixed(2)}</span>
            )}
            <span
              className="text-red-600 font-semibold text-lg"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              ₹{price.toFixed(2)}
              <meta itemProp="priceCurrency" content="INR" />
              <meta itemProp="price" content={price.toFixed(2)} />
              <link itemProp="availability" href={isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"} />
            </span>
          </div>
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              if (!isOutOfStock) handleAddToCart(product);
            }}
            className={`bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors w-full mt-2
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
