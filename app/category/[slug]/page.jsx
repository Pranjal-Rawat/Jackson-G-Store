// /app/category/[slug]/page.jsx – SEO-optimized Category product listing

import clientPromise from '../../lib/mongodb';
import { getCategoryJsonLD } from '../../lib/seo/jsonld';
import BusinessInfo from '../../../components/BusinessInfo';
import ProductsPageClient from '../../products/client';

// Helper: "milk-juice" → "Milk Juice"
function formatCategoryName(slug = '') {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

// Dynamic Metadata for SEO
export async function generateMetadata({ params }) {
  const { slug: categorySlug } = params;
  const categoryTitle = formatCategoryName(categorySlug);
  const title = `${categoryTitle} – Buy Online | Jackson Grocery Store | Grocery Store Dehradun`;
  const description = `Shop for ${categoryTitle} and other groceries online at Jackson Grocery Store, Dehradun. Best prices, fast delivery, and fresh products.`;
  const url = `https://jackson-grocery.com/category/${categorySlug}`;
  const ogImage = 'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png';

  return {
    title,
    description,
    keywords: `${categoryTitle}, ${categoryTitle} online, Jackson Grocery Store, Grocery Store Dehradun, Best Grocery Store, Fresh groceries Dehradun, Buy groceries online Dehradun, Jackson groceries`,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    other: {
      'ld+json': JSON.stringify(getCategoryJsonLD({
        categorySlug,
        categoryName: categoryTitle,
      })),
    },
  };
}

// Server-side page rendering with MongoDB
export default async function CategoryPage({ params }) {
  const { slug } = params;
  const categoryName = formatCategoryName(slug);

  let safeProducts = [];
  try {
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');

    const initialProducts = await db
      .collection('products')
      .find({ category: slug })
      .sort({ rank: 1 })
      .limit(50)
      .project({
        _id: 1,
        slug: 1,
        title: 1,
        image: 1,
        price: 1,
        stock: 1,
        category: 1,
        rank: 1,
      })
      .toArray();

    safeProducts = initialProducts.map((p) => ({
      ...p,
      _id: p._id?.toString() || '',
    }));
  } catch (err) {
    // If DB fails, safe fallback: show empty product list, but don't break the page
    console.error('CategoryPage DB error:', err);
    safeProducts = [];
  }

  return (
    <main className="pt-14 min-h-screen bg-white">
      {/* Main Category Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-800 mb-1 text-center">
        {categoryName}
      </h1>
      <div className="mx-auto my-3 border-b-2 border-[#ffcc29] w-12" aria-hidden="true" />

      {/* Dynamic Product Grid */}
      <ProductsPageClient initialProducts={safeProducts} category={slug} />

      {/* SEO Description */}
      <section className="max-w-2xl mx-auto my-8 px-4 text-center text-gray-600">
        <p>
          Discover the best deals in <strong>{categoryName}</strong>. Shop fresh, high-quality products online and enjoy quick delivery with Jackson Grocery Store in Dehradun.
        </p>
      </section>

      {/* Local Business Info */}
      <BusinessInfo />
    </main>
  );
}
