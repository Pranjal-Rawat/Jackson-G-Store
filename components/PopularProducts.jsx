'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '../stores/cartStore';

export default function PopularProducts({ products }) {
  const addToCart = useCartStore((state) => state.addItem);
  const [visibleCount, setVisibleCount] = useState(10);

  /* ---------- filter + sort ---------- */
  const popularSorted = useMemo(
    () =>
      products
        .filter((p) => p.popular === true || p.popular === 'true')
        .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0)),
    [products]
  );

  const visibleProducts = useMemo(
    () => popularSorted.slice(0, visibleCount),
    [popularSorted, visibleCount]
  );

  /* ---------- add-to-cart ---------- */
  const handleAddToCart = useCallback(
    (product) => {
      // 👉 first arg = clean product, second arg = units to add
      addToCart(product, 1);
    },
    [addToCart]
  );

  /* ---------- load more ---------- */
  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 10, popularSorted.length));
  }, [popularSorted.length]);

  /* ---------- product card ---------- */
  const ProductCard = ({ product, index }) => {
    const {
      _id,
      title,
      slug,
      description,
      stock = 0,
      unit,
      pcs,
      image,
      price = 0,
      mrp = 0,
      rank,
      popular,
    } = product;

    const isOutOfStock = stock <= 0;
    const displayPrice = parseFloat(price) || 0;
    const displayMRP = parseFloat(mrp) || 0;

    return (
      <Link
        href={`/products/${slug}`}
        className="group block bg-white rounded-lg shadow hover:shadow-md transition relative focus:outline-none"
        aria-label={`View details of ${title} – Jackson Grocery Store Dehradun`}
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* structured-data */}
        <meta itemProp="name" content={title} />
        <meta itemProp="sku" content={slug} />
        <meta
          itemProp="description"
          content={description || `Buy ${title} online in Dehradun`}
        />

        {/* badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {typeof rank === 'number' && (
            <span className="text-[10px] font-bold bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded-full shadow-sm border border-yellow-400">
              Rank #{rank}
            </span>
          )}
          {(popular === true || popular === 'true') && (
            <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full border border-red-300 shadow-sm">
              ★ Popular
            </span>
          )}
        </div>

        {/* image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={image || '/images/logo.svg'}
            alt={`${title} - Buy at Jackson Grocery Store Dehradun`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={index < 2}
            placeholder="blur"
            blurDataURL="/images/logo.svg"
            itemProp="image"
          />
          {isOutOfStock && (
            <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-0.5 rounded-full font-bold text-xs shadow">
              Out of Stock
            </span>
          )}
        </div>

        {/* info */}
        <div className="p-4">
          <h3
            className="font-medium text-gray-800 mb-1 truncate"
            itemProp="name"
          >
            {title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium mb-1">
            {unit && <span>{unit}</span>}
            {pcs && <span>{pcs} pcs</span>}
          </div>

          <div className="flex items-center gap-2 mb-1">
            {displayMRP > displayPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{displayMRP.toFixed(2)}
              </span>
            )}
            <span
              className="text-red-600 font-semibold text-lg"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              ₹{displayPrice.toFixed(2)}
              <meta itemProp="priceCurrency" content="INR" />
              <meta itemProp="price" content={displayPrice.toFixed(2)} />
              <link
                itemProp="availability"
                href={
                  isOutOfStock
                    ? 'https://schema.org/OutOfStock'
                    : 'https://schema.org/InStock'
                }
              />
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isOutOfStock) handleAddToCart(product);
            }}
            className={`w-full mt-2 text-sm px-4 py-2 rounded-lg transition-colors ${
              isOutOfStock
                ? 'bg-gray-300 text-white cursor-not-allowed opacity-60'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            disabled={isOutOfStock}
            aria-label={
              isOutOfStock ? `Out of Stock` : `Add ${title} to cart`
            }
            type="button"
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </Link>
    );
  };

  /* ---------- render ---------- */
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Popular Grocery Products in Dehradun
        </h2>
        <p className="text-gray-700 mb-6 max-w-2xl">
          Discover top-selling groceries, fruits, vegetables, and daily
          essentials. Shop the most popular products at Jackson Grocery Store,
          Dehradun for best prices and fast delivery.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleProducts.map((product, i) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              index={i}
            />
          ))}
        </div>

        {visibleCount < popularSorted.length && (
          <div className="py-8 text-center">
            <button
              onClick={handleLoadMore}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow transition"
              type="button"
              aria-label="Load more popular products"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
