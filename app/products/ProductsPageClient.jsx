'use client';

import Header from '@/components/Header';
import ProductModal from '@/components/ProductModal';
import CustomLoader from '@/components/CustomLoader';
import LoadMoreButton from '@/components/LoadMoreButton';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { Search } from 'lucide-react'; // For the search icon

export default function ProductsPageClient({ initialProducts, category }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const addToCart = useCartStore((state) => state.addItem);

  // Reset products when category changes
  useEffect(() => {
    setProducts(initialProducts);
    setHasMore(true);
    setPage(1);
    setQuery('');
  }, [initialProducts, category]);

  // Search
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
      let searchUrl = `/api/search?q=${encodeURIComponent(value)}`;
      if (category) searchUrl += `&category=${encodeURIComponent(category)}`;
      const res = await fetch(searchUrl);
      const data = await res.json();
      setProducts(data);
      setHasMore(false); // Search disables pagination for now
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }

  // Load More Button Handler (Category-aware)
  async function loadMore() {
    setLoading(true);
    try {
      let url = `/api/products?skip=${products.length}&limit=50`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      const res = await fetch(url);
      const moreProducts = await res.json();
      if (!moreProducts.length) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...moreProducts]);
        setPage((p) => p + 1);
      }
    } catch {
      setHasMore(false);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-800">
      <Header />

      <ProductModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, qty, option) => {
          addToCart({ ...prod, quantity: qty, option });
          setSelectedProduct(null);
        }}
      />

      <section className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder={`Search ${category ? category.replace(/-/g, ' ') : 'products'}...`}
            value={query}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition outline-none placeholder:text-gray-400 text-base"
            aria-label="Search products"
          />
        </div>

        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <CustomLoader />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {products.map((product) => (
              <div
                key={product._id}
                className="relative bg-white/90 rounded-2xl shadow group hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 overflow-hidden flex flex-col"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Image */}
                <div className="relative w-full h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <Image
                    src={product.image || '/placeholder.png'}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    loading="lazy"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-br from-primary-200 to-secondary-200 transition-opacity" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col p-4 gap-2">
                  <h3 className="text-base font-semibold truncate text-gray-800">{product.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="bg-primary-100 text-primary-700 font-bold rounded-full px-3 py-1 text-sm">
                      ₹{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
                    </span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="bg-primary-500 hover:bg-primary-600 text-white text-xs px-4 py-2 rounded-lg transition-colors shadow focus:ring-2 focus:ring-primary-300 focus:outline-none"
                      aria-label={`Add ${product.title} to cart`}
                    >
                      Add to Cart
                    </button>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className="text-xs text-blue-500 underline hover:text-blue-700 mt-1 self-start"
                    aria-label={`Quick view of ${product.title}`}
                  >
                    Quick View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : query.length >= 2 ? (
          <p className="text-center text-gray-500 py-10">No products found.</p>
        ) : (
          <p className="text-center text-gray-400 py-10">No products found.</p>
        )}

        {query.length < 2 && loading && <CustomLoader />}
        {hasMore && !loading && (
          <div className="flex justify-center mt-10">
            <LoadMoreButton onClick={loadMore} disabled={!hasMore} />
          </div>
        )}
      </section>
    </main>
  );
}
