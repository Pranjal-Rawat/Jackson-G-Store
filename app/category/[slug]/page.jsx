// /app/category/[slug]/page.jsx – SEO-optimized Category product listing

import clientPromise from '../../lib/mongodb';
import { getCategoryJsonLD } from '../../lib/seo/jsonld';
import BusinessInfo from '../../../components/BusinessInfo';
import ProductsPageClient from '@/app/products/ProductsPageClient';

// --- Fix: Await params! ---
export async function generateMetadata({ params }) {
  const { slug: categorySlug } = await params;
  const categoryTitle = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const title = `${categoryTitle} – Buy Online | Jackson Grocery Store | Grocery Store Dehradun`;
  const description = `Shop for ${categoryTitle} and other groceries online at Jackson Grocery Store, Dehradun. Best prices, fast delivery, and fresh products.`;
  const url = `https://jackson-grocery.com/category/${categorySlug}`;
  const ogImage = 'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png';

  return {
    title,
    description,
    keywords: `${categoryTitle}, ${categoryTitle} online, Jackson Grocery Store, Grocery Store Dehradun, Best Grocery Store, Fresh groceries Dehradun, Buy groceries online Dehradun, Jackson groceries`,
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
    alternates: {
      canonical: url,
    },
    other: {
      // BreadcrumbList for SEO (Home > Category)
      'ld+json': JSON.stringify(getCategoryJsonLD({
        categorySlug,
        categoryName: categoryTitle,
      })),
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');
  // --- Fetch products in this category, SORTED by rank ascending ---
  const initialProducts = await db
    .collection('products')
    .find({ category: slug })
    .sort({ rank: 1 }) // <-- Sort by rank!
    .limit(50)
    .toArray();

  const safeProducts = initialProducts.map((p) => ({
    ...p,
    _id: p._id?.toString(),
  }));

  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <main className="pt-14 min-h-screen bg-white">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-gray-800 mb-1 text-center">
        {categoryName}
      </h1>
      <div className="mx-auto my-3 border-b-2 border-[#ffcc29] w-12" />
      <ProductsPageClient initialProducts={safeProducts} category={slug} />
      <section className="max-w-2xl mx-auto my-8 px-4 text-center text-gray-600">
        <p>
          Discover the best deals in {categoryName}. Shop fresh, high-quality products online and enjoy quick delivery with Jackson Grocery Store in Dehradun.
        </p>
      </section>
      <BusinessInfo />
    </main>
  );
}
