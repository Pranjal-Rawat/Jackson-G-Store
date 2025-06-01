// components/PopularProducts.jsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import ProductModal from './ProductModal';
import products from '@/data/products';

export default function PopularProducts() {
  const addToCart = useCartStore((state) => state.addItem);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const loadMoreRef = useRef(null);
  const observer = useRef(null);

  // Memoize sorted popular products
  const { popularSorted, remainingPopular } = useMemo(() => {
    const sorted = [...products]
      .filter((p) => p.popular)
      .sort((a, b) => a.rank - b.rank);
      
    return {
      popularSorted: sorted,
      remainingPopular: sorted.slice(10)
    };
  }, []);

  // Calculate visible products
  const visibleProducts = useMemo(() => [
    ...popularSorted.slice(0, 10),
    ...remainingPopular.slice(0, visibleCount - 10)
  ], [popularSorted, remainingPopular, visibleCount]);

  // Handle infinite scroll
  useEffect(() => {
    if (!remainingPopular.length) return;

    const options = {
      rootMargin: '200px',
      threshold: 1.0
    };

    const handleIntersect = ([entry]) => {
      if (entry.isIntersecting) {
        setVisibleCount(prev => Math.min(prev + 10, 10 + remainingPopular.length));
      }
    };

    observer.current = new IntersectionObserver(handleIntersect, options);
    
    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [remainingPopular.length]);

  const handleAddToCart = (product, quantity, option) => {
    addToCart({
      ...product,
      quantity,
      option,
    });
  };

  const ProductCard = ({ product }) => (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedProduct(product)}
    >
      <Link
        href={`/products/${product.slug}`}
        onClick={(e) => e.preventDefault()}
        className="block relative h-48 w-full overflow-hidden"
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={product.id <= 4}
        />
      </Link>

      <div className="p-4">
        <h3 className="font-medium mb-1">{product.title}</h3>
        <div className="flex justify-between items-center">
          <span className="text-red-600 font-semibold">${product.price.toFixed(2)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
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
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {visibleProducts.length < popularSorted.length && (
            <div ref={loadMoreRef} className="py-8 text-center">
              <p className="text-gray-600 animate-pulse">Loading more products...</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}