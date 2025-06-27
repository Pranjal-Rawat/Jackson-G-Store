'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '../stores/cartStore';
import AddToCartButton from './AddToCartButton';
import { getOptimizedCloudinaryUrl } from '../app/lib/getOptimizedCloudinaryUrl';

export default function PopularProducts({ products = [] }) {
  const [visibleCount, setVisibleCount] = useState(10);

  // Compute popular & sorted only once per products
  const popularSorted = useMemo(() => (
    products
      .filter((p) => p.popular === true || p.popular === 'true')
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
  ), [products]);

  const visibleProducts = useMemo(
    () => popularSorted.slice(0, visibleCount),
    [popularSorted, visibleCount]
  );

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 10, popularSorted.length));
  }, [popularSorted.length]);

  // --- Product Card ---
  const ProductCard = ({ product, index }) => {
    const {
      _id, title, slug, description, stock = 0,
      unit, pcs, image, price = 0, mrp = 0, rank, popular
    } = product;

    const getVirtualStock = useCartStore((s) => s.getVirtualStock);
    const virtualStock = getVirtualStock(_id ?? slug, stock);
    const isOutOfStock = (stock ?? 0) <= 0 || virtualStock <= 0;

    // Cloudinary performance
    const optimizedImage =
      image?.includes('cloudinary.com')
        ? getOptimizedCloudinaryUrl(image)
        : image || '/images/logo.svg';

    return (
      <Link
        href={`/products/${slug}`}
        className="group block bg-white rounded-lg shadow hover:shadow-md transition relative focus:outline-none"
        aria-label={`View details of ${title} – Jackson Grocery Store Dehradun`}
        itemScope
        itemType="https://schema.org/Product"
        tabIndex={0}
      >
        {/* Schema for SEO */}
        <meta itemProp="name" content={title} />
        <meta itemProp="sku" content={slug} />
        <meta itemProp="description" content={description || `Buy ${title} online in Dehradun`} />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {typeof rank === 'number' && (
            <span className="text-[10px] font-bold bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded-full shadow-sm border border-yellow-400">
              Rank #{rank}
            </span>
          )}
          {popular && (
            <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full border border-red-300 shadow-sm">
              ★ Popular
            </span>
          )}
        </div>

        {/* Product Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={optimizedImage}
            alt={title + ' - Popular Grocery Product in Dehradun'}
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
          {!isOutOfStock && virtualStock <= 3 && (
            <span className="absolute bottom-2 right-2 bg-yellow-400 text-black px-2 py-0.5 rounded font-semibold text-xs shadow">
              {virtualStock} left
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-1 truncate" itemProp="name">
            {title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 font-medium mb-1">
            {unit && <span>{unit}</span>}
            {pcs && <span>{pcs} pcs</span>}
          </div>

          <div className="flex items-center gap-2 mb-1">
            {mrp > price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{(+mrp).toFixed(2)}
              </span>
            )}
            <span
              className="text-red-600 font-semibold text-lg"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              ₹{(+price).toFixed(2)}
              <meta itemProp="priceCurrency" content="INR" />
              <meta itemProp="price" content={(+price).toFixed(2)} />
              <link
                itemProp="availability"
                href={isOutOfStock
                  ? 'https://schema.org/OutOfStock'
                  : 'https://schema.org/InStock'}
              />
            </span>
          </div>
          <AddToCartButton
            product={product}
            disabled={isOutOfStock}
            className="w-full mt-2 text-sm"
          />
        </div>
      </Link>
    );
  };

  // --- ItemList Schema (SEO) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Popular Grocery Products in Dehradun",
    "itemListElement": visibleProducts.map((product, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `/products/${product.slug}`,
      "name": product.title,
    })),
  };

  return (
    <section
      className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-50"
      aria-label="Popular Products"
    >
      {/* SEO: Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            <ProductCard key={product._id || product.id} product={product} index={i} />
          ))}
        </div>

        {visibleCount < popularSorted.length && (
          <div className="py-8 text-center">
            <button
              onClick={handleLoadMore}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow transition font-semibold"
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
