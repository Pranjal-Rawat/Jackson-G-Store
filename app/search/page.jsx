// /app/search/page.jsx

// ---- SEO Metadata ----
export const metadata = {
  title: 'Search Products | Jackson Grocery Store | Grocery Store Dehradun',
  description:
    'Find fresh groceries, fruits, vegetables, snacks, and essentials at Jackson Grocery Store. Search for products and shop online with fast home delivery in Dehradun.',
  keywords:
    'Search groceries, Grocery Store Dehradun, Buy groceries online, Jackson Grocery Store search, Fresh fruits, Online grocery, World of groceries',
  alternates: {
    canonical: 'https://jackson-grocery.com/search',
  },
  openGraph: {
    title: 'Search Products | Jackson Grocery Store',
    description:
      'Find and shop for the best groceries in Dehradun with Jackson Grocery Store. Search results for all your daily essentials.',
    url: 'https://jackson-grocery.com/search',
    siteName: 'Jackson Grocery Store',
    images: [
      {
        url: 'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png',
        width: 1200,
        height: 630,
        alt: 'Jackson Grocery Store Search',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Products | Jackson Grocery Store',
    description:
      'Find the best groceries in Dehradun with Jackson Grocery Store. Fast delivery and fresh products.',
    images: [
      'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png',
    ],
  },
};

import clientPromise from '../lib/mongodb';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }) {
  const q = searchParams.q || '';

  if (!q) {
    return (
      <main className="max-w-2xl mx-auto pt-32 pb-16 px-4 min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-4">Search</h1>
        <p className="text-gray-500">Type a query above to search for products.</p>
      </main>
    );
  }

  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');

  const mainProduct = await db.collection('products').findOne({
    title: { $regex: `^${q}$`, $options: 'i' },
  });

  const related = await db.collection('products')
    .find({
      title: { $regex: q, $options: 'i' },
      ...(mainProduct && { _id: { $ne: mainProduct._id } }),
    })
    .limit(24)
    .toArray();

  const safeRelated = related.map((p) => ({
    ...p,
    _id: p._id?.toString(),
  }));

  return (
    <main className="max-w-7xl mx-auto pt-[7rem] pb-16 px-4 min-h-[70vh] bg-gradient-to-b from-[#fffcf7] via-white to-[#fff6e3]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Search Results for <span className="text-red-600">{q}</span>
      </h1>

      {mainProduct ? (
        <div className="mb-10 p-4 rounded-xl shadow bg-white flex flex-col sm:flex-row items-center gap-5 border border-[#ffcc29]/30">
          <Image
            src={mainProduct.image || '/images/logo.svg'}
            alt={mainProduct.title}
            width={100}
            height={100}
            className="rounded-2xl border bg-white object-contain w-24 h-24"
            priority
          />
          <div className="flex-1">
            <Link
              href={`/products/${mainProduct.slug}`}
              className="text-lg font-bold hover:text-red-600 transition"
            >
              {mainProduct.title}
            </Link>
            <div className="text-red-600 font-semibold text-xl mt-2">
              ₹{typeof mainProduct.price === 'number' ? mainProduct.price.toFixed(2) : 'N/A'}
            </div>
            <div className="text-gray-500 text-sm">{mainProduct.category}</div>
          </div>
        </div>
      ) : (
        <div className="mb-8 text-gray-500 italic">No exact product found for "{q}"</div>
      )}

      <h2 className="font-semibold mb-3 text-xl">
        {mainProduct ? 'Related Products' : 'Products Matching Your Search'}
      </h2>

      {safeRelated.length === 0 ? (
        <div className="text-gray-500 mb-8">No related products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {safeRelated.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="group bg-white border border-[#ffcc29]/20 rounded-2xl p-4 flex flex-col items-center shadow hover:shadow-lg transition"
            >
              <div className="relative w-28 h-28 mb-2 flex items-center justify-center">
                <Image
                  src={product.image || '/images/logo.svg'}
                  alt={product.title}
                  fill
                  className="object-contain rounded-xl bg-white"
                  sizes="112px"
                />
              </div>
              <div className="text-sm font-semibold text-center mb-1 truncate w-full">
                {product.title}
              </div>
              <div className="text-red-600 font-bold text-base mb-1">
                ₹{typeof product.price === 'number' ? product.price.toFixed(2) : 'N/A'}
              </div>
              <div className="text-xs text-gray-500">{product.category}</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
