import clientPromise from '../lib/mongodb';
import Image from 'next/image';
import Link from 'next/link';

/* ---------------------------------- SEO ---------------------------------- */
export const metadata = {
  title: 'Search Products | Jackson Grocery Store | Grocery Store Dehradun',
  description:
    'Find fresh groceries, fruits, vegetables, snacks and essentials at Jackson Grocery Store. Search for products and shop online with fast home delivery in Dehradun.',
  keywords:
    'Search groceries, Grocery Store Dehradun, Buy groceries online, Jackson Grocery Store search, Fresh fruits, Online grocery, World of groceries',
  alternates: { canonical: 'https://jackson-grocery.com/search' },
  openGraph: {
    title: 'Search Products | Jackson Grocery Store',
    description:
      'Find and shop for the best groceries in Dehradun with Jackson Grocery Store.',
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

/* Always SSR for freshest index */
export const dynamic = 'force-dynamic';

/* ------------------------------------------------------------------------ */
export default async function SearchPage({ searchParams }) {
  const q = (searchParams.q || '').trim();

  /* ---------- 1. No query → gentle nudge ---------- */
  if (!q) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="mb-2 text-3xl font-extrabold text-gray-800">Search</h1>
        <p className="text-gray-500">Type a keyword in the bar above to find products.</p>
      </main>
    );
  }

  /* ---------- 2. DB fetch ---------- */
  let mainProduct = null;
  let related = [];
  try {
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');

    // Exact match (featured card)
    mainProduct = await db
      .collection('products')
      .findOne({ title: { $regex: `^${q}$`, $options: 'i' } });

    // Related products
    related = await db
      .collection('products')
      .find({
        title: { $regex: q, $options: 'i' },
        ...(mainProduct && { _id: { $ne: mainProduct._id } }),
      })
      .limit(24)
      .toArray();
  } catch (err) {
    // Defensive: fallback to empty if DB fails
    mainProduct = null;
    related = [];
  }

  const safeRelated = related.map((p) => ({ ...p, _id: p._id.toString() }));

  /* ---------- 3. UI ---------- */
  return (
    <main className="min-h-[70vh] px-4 pb-16 pt-[6.5rem] sm:pt-[7rem] bg-gradient-to-b from-[#fffcf7] via-white to-[#fff6e3]">
      {/* Heading */}
      <h1 className="mb-8 text-2xl font-bold sm:text-3xl">
        Results for <span className="text-primary-600">{q}</span>
      </h1>

      {/* Featured / exact */}
      {mainProduct ? (
        <div className="mb-12 flex flex-col gap-5 rounded-2xl border border-yellow-200 bg-white p-5 shadow-theme sm:flex-row sm:items-center" tabIndex={0} aria-label={`Exact match for ${mainProduct.title}`}>
          <Image
            src={mainProduct.image || '/images/logo.svg'}
            alt={mainProduct.title}
            width={110}
            height={110}
            className="h-28 w-28 rounded-xl bg-white object-contain"
            priority
            placeholder="blur"
            blurDataURL="/images/logo.svg"
          />
          <div className="flex-1">
            <Link
              href={`/products/${mainProduct.slug}`}
              className="mb-1 block text-lg font-bold tracking-tight hover:text-primary-600"
            >
              {mainProduct.title}
            </Link>
            <p className="text-xl font-semibold text-red-600">
              ₹{(+mainProduct.price || 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{mainProduct.category}</p>
          </div>
        </div>
      ) : (
        <p className="mb-8 text-gray-500 italic">
          No exact product found for “{q}”.
        </p>
      )}

      {/* Label */}
      <h2 className="mb-5 text-xl font-semibold">
        {mainProduct ? 'Related Products' : 'Matching Products'}
      </h2>

      {/* Related grid */}
      {safeRelated.length === 0 ? (
        <p className="text-gray-500">No related products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {safeRelated.map((p) => (
            <Link
              key={p._id}
              href={`/products/${p.slug}`}
              className="group rounded-2xl border border-yellow-200 bg-white p-4 shadow-theme
                         transition-transform duration-150 hover:scale-[1.03] focus-visible:scale-[1.03]"
              aria-label={`View details for ${p.title}`}
              tabIndex={0}
            >
              <div className="relative mb-2 flex h-24 w-full items-center justify-center">
                <Image
                  src={p.image || '/images/logo.svg'}
                  alt={p.title}
                  fill
                  className="object-contain rounded-xl bg-white"
                  sizes="112px"
                  placeholder="blur"
                  blurDataURL="/images/logo.svg"
                />
              </div>

              <h3 className="mb-1 line-clamp-2 text-sm font-semibold">{p.title}</h3>

              <p className="mb-1 text-base font-bold text-red-600">
                ₹{typeof p.price === 'number' ? p.price.toFixed(2) : 'N/A'}
              </p>

              <span className="text-[11px] text-gray-500">{p.category}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
