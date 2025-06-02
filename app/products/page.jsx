// app/products/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';
import ProductModal from '@/components/ProductModal';
import Header from '@/components/Header';

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (query.length < 2) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, [query]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
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

      <section className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
            aria-label="Search products"
          />
        </div>

        {/* Product Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <Link href={`/products/${product.slug}`} passHref>
                  <div
                    className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedProduct(product);
                    }}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      loading="lazy"
                    />
                    </div>
                </Link>
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-md font-semibold truncate">{product.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-semibold">
                      ₹{product.price.toFixed(2)}
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
            ))}
          </div>
        ) : query.length >= 2 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <p className="text-center text-gray-400">Start typing to search products...</p>
        )}
      </section>
    </main>
  );
}
