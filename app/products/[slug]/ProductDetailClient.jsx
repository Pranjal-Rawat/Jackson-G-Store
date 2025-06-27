// /app/products/[slug]/ProductDetailClient.jsx

'use client';

import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '../../../components/AddToCartButton';
import BusinessInfo from '../../../components/BusinessInfo';
import { useCartStore } from '../../../stores/cartStore';

export default function ProductDetailClient({ main, relatedSafe }) {
  // Zustand for live stock
  const getVirtualStock = useCartStore((s) => s.getVirtualStock);

  // Main product stock
  const virtualStock = getVirtualStock(main._id, main.stock ?? 0);
  const isOutOfStock = (main.stock ?? 0) <= 0 || virtualStock <= 0;
  const showFewLeft = !isOutOfStock && virtualStock <= 3 && virtualStock > 0;

  return (
    <main className="max-w-3xl mx-auto pt-28 pb-16 px-2 sm:px-4 bg-gray-50 min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-md flex flex-col md:flex-row gap-8 p-4 sm:p-8 relative">
        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
          {typeof main.rank === 'number' && (
            <span className="bg-[#ffcc29] text-[#ed3237] px-2 py-1 rounded-full text-xs font-bold border border-[#ffe58a] shadow-sm">
              Rank #{main.rank}
            </span>
          )}
          {main.popular && (
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold border border-red-300 shadow-sm">
              ★ Popular
            </span>
          )}
        </div>
        {isOutOfStock && (
          <span className="absolute top-5 right-5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
            Out of Stock
          </span>
        )}
        {showFewLeft && (
          <span className="absolute top-5 right-32 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow">
            {virtualStock} left
          </span>
        )}

        {/* Product Image */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative w-full h-56 sm:h-72 md:h-96 bg-white rounded-xl overflow-hidden shadow">
            <Image
              src={main.image || '/images/logo.svg'}
              alt={main.title}
              fill
              className="object-contain bg-white"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
              placeholder="blur"
              blurDataURL="/images/logo.svg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">{main.title}</h1>
            {(main.unit || main.pcs) && (
              <div className="flex gap-2 text-sm text-gray-500 font-medium mb-2">
                {main.unit && <span>{main.unit}</span>}
                {main.pcs && <span className="text-gray-400">| {main.pcs} PCS</span>}
              </div>
            )}
            <p className="text-base sm:text-lg text-gray-700 mb-4">{main.description}</p>
            <div className="flex items-center gap-2 mb-3">
              {main.mrp && (
                <span className="text-sm text-gray-400 line-through">
                  MRP ₹{typeof main.mrp === 'number' ? main.mrp.toFixed(2) : main.mrp}
                </span>
              )}
              <span className="text-2xl text-red-600 font-extrabold">₹{Number(main.price).toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-500 mb-1">Category: {main.category}</div>
            <div className="text-sm text-gray-500 mb-3">
              {isOutOfStock ? (
                <span className="font-bold text-red-600">Out of Stock</span>
              ) : (
                <>In Stock: {virtualStock}</>
              )}
            </div>
          </div>
          <div className="mt-4">
            <AddToCartButton product={main} disabled={isOutOfStock} className="w-full" />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedSafe.length > 0 && (
        <>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 mt-12 text-gray-800">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedSafe.map((p) => {
              const relVirtualStock = getVirtualStock(p._id, p.stock ?? 0);
              const isOut = (p.stock ?? 0) <= 0 || relVirtualStock <= 0;
              const showRelFewLeft = !isOut && relVirtualStock <= 3 && relVirtualStock > 0;
              return (
                <div
                  key={p._id}
                  className="group bg-white border border-[#ffcc29]/20 rounded-2xl p-3 flex flex-col items-center shadow hover:shadow-lg transition relative"
                >
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {typeof p.rank === 'number' && (
                      <span className="bg-[#ffcc29] text-[#ed3237] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#ffe58a] shadow-sm">
                        Rank #{p.rank}
                      </span>
                    )}
                    {p.popular && (
                      <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold border border-red-300 shadow-sm">
                        ★ Popular
                      </span>
                    )}
                  </div>
                  {isOut && (
                    <span className="absolute top-3 right-3 z-10 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow">
                      Out of Stock
                    </span>
                  )}
                  {showRelFewLeft && (
                    <span className="absolute bottom-3 right-3 z-10 bg-yellow-400 text-black px-2 py-0.5 rounded font-semibold text-xs shadow">
                      {relVirtualStock} left
                    </span>
                  )}
                  <Link href={`/products/${p.slug}`} className="w-full flex flex-col items-center">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2">
                      <Image
                        src={p.image || '/images/logo.svg'}
                        alt={p.title || 'Related product'}
                        fill
                        className="object-contain bg-white rounded-xl"
                        sizes="96px"
                        placeholder="blur"
                        blurDataURL="/images/logo.svg"
                      />
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-center mb-1 truncate w-full">
                      {p.title}
                    </div>
                    {(p.unit || p.pcs) && (
                      <div className="text-[11px] text-gray-500 font-medium mb-1 flex gap-1">
                        {p.unit && <span>{p.unit}</span>}
                        {p.pcs && <span className="text-gray-400">| {p.pcs} PCS</span>}
                      </div>
                    )}
                    <div className="flex items-center gap-1 mb-1">
                      {p.mrp && (
                        <span className="text-[11px] text-gray-400 line-through">
                          ₹{typeof p.mrp === 'number' ? p.mrp.toFixed(2) : p.mrp}
                        </span>
                      )}
                      <span className="text-red-600 font-bold text-sm">
                        ₹{typeof p.price === 'number' ? p.price.toFixed(2) : 'N/A'}
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500">{p.category}</div>
                  </Link>
                  <div className="mt-2 w-full">
                    <AddToCartButton product={p} className="w-full py-1 text-xs" disabled={isOut} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <BusinessInfo />
    </main>
  );
}
