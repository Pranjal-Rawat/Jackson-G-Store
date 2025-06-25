'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import CustomLoader from '../../components/CustomLoader';
import LoadMoreButton from '../../components/LoadMoreButton';
import Image from 'next/image';
import { useCartStore } from '../../stores/cartStore';
import { Search } from 'lucide-react';
import AdBanner from '../../components/Ad-Promotions';

// Product image with fallback
function ProductImage({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || '/images/logo.svg');
  return (
    <Image
      src={imgSrc}
      alt={alt || 'Product image'}
      fill
      className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
      loading="lazy"
      onError={() => setImgSrc('/images/logo.svg')}
    />
  );
}

// Custom cart icon
function CartIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <circle cx="7" cy="16" r="1.5" fill="#ed3237" />
      <circle cx="15" cy="16" r="1.5" fill="#ed3237" />
      <path
        d="M2.5 3.5h2l2.28 9.12a1.25 1.25 0 0 0 1.21.88h6.5a1.25 1.25 0 0 0 1.21-.88l1.38-4.36a.75.75 0 0 0-.72-.98H7"
        stroke="#ed3237"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Add to Cart Button
function AddToCartButton({ product, quantity = 1, option = null, className = '', disabled = false }) {
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (e) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, quantity, option });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-1 px-3 py-1 bg-gradient-to-tr from-[#ed3237] to-[#ffcc29] hover:from-[#ffcc29] hover:to-[#ed3237] text-white font-bold rounded-full shadow hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ffcc29]/60 transition-all duration-150 group text-xs min-w-[80px] sm:min-w-[100px] ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      } ${className}`}
      aria-label={disabled ? 'Out of Stock' : `Add ${product?.title || 'product'} to cart`}
      type="button"
    >
      <span className="z-10 flex items-center">
        <CartIcon className="w-4 h-4 mr-1 text-[#ffcc29]" />
        <span className="font-bold tracking-wide">
          {disabled ? 'Out of Stock' : 'Add'}
        </span>
      </span>
    </button>
  );
}

// Main Component
export default function ProductsPageClient({ initialProducts }) {
  const router = useRouter();
  const initialRef = useRef(initialProducts);
  const [products, setProducts] = useState(initialRef.current);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');

  const handleSearch = async (value) => {
    setQuery(value);
    if (value.length < 2) {
      setProducts(initialRef.current);
      setHasMore(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setProducts(data);
      setHasMore(false);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products?skip=${products.length}&limit=50`);
      const more = await res.json();
      if (!more.length) setHasMore(false);
      else setProducts((prev) => [...prev, ...more]);
    } catch {
      setHasMore(false);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffcf7] via-white to-[#fff6e3] text-[#272f38] pt-[80px]">
      <Header />
      <section className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-12 py-4">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ed3237]">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#ed3237]/20 rounded-xl shadow focus:ring-2 focus:ring-[#ed3237] focus:border-[#ed3237] transition outline-none placeholder:text-gray-400 text-base"
            aria-label="Search products"
            autoComplete="off"
          />
        </div>

        {/* Promotional Banner */}
        <AdBanner
          title="Monsoon Sale: Up to 40% OFF!"
          description="Fresh veggies and fruits delivered at your doorstep. Hurry, ends soon!"
          image="/images/ad-monsoon.jpg"
          cta="Shop Fresh"
          link="/category/fruits"
          bg="bg-green-100"
        />

        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <CustomLoader />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7">
            {products.map((product) => {
              const stock = product.stock ?? 0;
              const isOutOfStock = stock <= 0;
              return (
                <div
                  key={product._id || product.id}
                  className={`relative bg-white rounded-2xl shadow group border border-[#ffcc29]/20 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg cursor-pointer ${
                    isOutOfStock ? 'opacity-80 pointer-events-auto' : ''
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${product.title}`}
                  onClick={() => router.push(`/products/${product.slug}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') router.push(`/products/${product.slug}`);
                  }}
                >
                  {isOutOfStock && (
                    <span className="absolute top-2 right-2 z-10 bg-red-600 text-white px-2 py-0.5 rounded-full font-bold text-xs shadow">
                      Out of Stock
                    </span>
                  )}

                  <div className="relative w-full h-36 sm:h-44 bg-gradient-to-br from-[#fffdfa] to-[#fff7dc] flex items-center justify-center">
                    <ProductImage
                      src={product.image}
                      alt={`Buy ${product.title} in Dehradun | Jackson Grocery Store`}
                    />
                  </div>

                  <div className="flex-1 flex flex-col p-3 gap-1">
                    <h3 className="text-base font-semibold truncate">{product.title}</h3>
                    <div className="flex gap-2 text-xs text-gray-600">
                      {product.unit && <span>{product.unit}</span>}
                      {product.pcs && <span className="text-gray-400">| {product.pcs} PCS</span>}
                    </div>
                    <div className="flex items-center gap-2 my-1">
                      {product.mrp && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{Number(product.mrp).toFixed(2)}
                        </span>
                      )}
                      <span className="bg-[#ffcc29] text-[#ed3237] font-bold rounded-full px-3 py-1 text-sm shadow-sm">
                        ₹{Number(product.price).toFixed(2)}
                      </span>
                    </div>
                    <AddToCartButton product={product} disabled={isOutOfStock} className="py-1 px-3 text-xs rounded-full font-bold" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : query.length >= 2 ? (
          <div className="flex flex-col items-center py-14 opacity-80">
            <Image src="/images/logo.svg" alt="Jackson Grocery Logo" width={60} height={60} />
            <p className="mt-6 text-lg text-[#ed3237] font-semibold">No products found.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-14 opacity-70">
            <Image src="/images/logo.svg" alt="Jackson Grocery Logo" width={56} height={56} />
            <p className="mt-5 text-base text-[#ffcc29]">No products found.</p>
          </div>
        )}

        {/* Load More Button */}
        {query.length < 2 && loading && <CustomLoader />}
        {hasMore && !loading && (
          <div className="flex justify-center mt-10">
            <LoadMoreButton onClick={loadMore} disabled={!hasMore || loading} />
          </div>
        )}
      </section>
    </main>
  );
}
