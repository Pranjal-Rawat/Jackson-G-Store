'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import ProductModal from './ProductModal';

export default function PopularProducts({ products }) {
  const addToCart = useCartStore((state) => state.addItem);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  // Sort/filter popular products from props
  const popularSorted = useMemo(() => {
    return [...products]
      .filter((p) => p.popular)
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  }, [products]);

  const visibleProducts = useMemo(() => {
    return popularSorted.slice(0, visibleCount);
  }, [popularSorted, visibleCount]);

  const handleAddToCart = (product, quantity = 1, option = null) => {
    addToCart({ ...product, quantity, option });
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, popularSorted.length));
  };

  const ProductCard = ({ product }) => (
    <div
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => setSelectedProduct(product)}
    >
      <Link
        href={`/products/${product.slug}`}
        onClick={(e) => e.preventDefault()}
        className="block relative h-48 w-full overflow-hidden rounded-t-lg"
        aria-label={`View details of ${product.title}`}
      >
        <Image
          src={product.image || '/placeholder.png'}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={product.rank && product.rank <= 4}
        />
      </Link>

      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-1">{product.title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-red-600 font-semibold">
            ₹{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            aria-label={`Add ${product.title} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ProductModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Our Popular Products</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>

          {visibleCount < popularSorted.length && (
            <div className="py-8 text-center">
              <button
                onClick={handleLoadMore}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
