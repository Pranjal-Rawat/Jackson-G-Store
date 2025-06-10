"use client";

import Header from '@/components/Header'; 
import ProductModal from '@/components/ProductModal';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/stores/cartStore';

export default function ProductsPageClient({ initialProducts }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1); // Each page = 50
  const addToCart = useCartStore((state) => state.addItem);
  const loaderRef = useRef();

  // Infinite Scroll Effect
  useEffect(() => {
    if (query.length >= 2) return; // Don't auto-load when searching

    const observer = new window.IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setLoading(true);
          try {
            const res = await fetch(`/api/products?skip=${products.length}&limit=50`);
            const moreProducts = await res.json();
            if (moreProducts.length === 0) {
              setHasMore(false);
            } else {
              setProducts((prev) => [...prev, ...moreProducts]);
              setPage((p) => p + 1);
            }
          } catch (err) {
            setHasMore(false);
          }
          setLoading(false);
        }
      },
      { rootMargin: '100px' }
    );
    const node = loaderRef.current;
    if (node) observer.observe(node);
    return () => { if (node) observer.unobserve(node); };
    // eslint-disable-next-line
  }, [products, hasMore, loading, query]);

  // Search effect
  async function handleSearch(value) {
    setQuery(value);
    if (value.length < 2) {
      setProducts(initialProducts);
      setHasMore(true);
      setPage(1);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setProducts(data);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      {/* Product Quick View Modal */}
      <ProductModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, qty, option) => {
          addToCart({ ...prod, quantity: qty, option });
          setSelectedProduct(null);
        }}
      />

      <section className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={e => handleSearch(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            aria-label="Search products"
          />
        </div>

        {/* Product Grid */}
        {loading && products.length === 0 ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative w-full h-48">
                  <Image
                    src={product.image || '/placeholder.png'}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-lg"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-md font-semibold truncate">{product.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-semibold">
                      ₹{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                      aria-label={`Add ${product.title} to cart`}
                    >
                      Add to Cart
                    </button>
                  </div>
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-xs text-blue-600 underline mt-2 inline-block"
                    onClick={e => e.stopPropagation()}
                    aria-label={`View details of ${product.title}`}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : query.length >= 2 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <p className="text-center text-gray-400">No products found.</p>
        )}

        {/* Infinite Scroll Loader */}
        {hasMore && query.length < 2 && (
          <div ref={loaderRef} className="w-full flex justify-center py-8">
            <span className="text-gray-500">{loading ? "Loading more..." : "Scroll to load more"}</span>
          </div>
        )}
      </section>
    </main>
  );
}
