// /app/category/[slug]/page.jsx – SEO-optimized Category product listing

import clientPromise from '../../lib/mongodb';
import ProductsPageClient from '../../products/ProductsPageClient';
import { getCategoryJsonLD } from '../../lib/seo/jsonld';
import BusinessInfo from '../../../components/BusinessInfo';
// LocalBusinessLDJson REMOVED (JSON-LD now in metadata)

export async function generateMetadata({ params }) {
  const categorySlug = params.slug;
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
  const { slug } = params;
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');
  const initialProducts = await db
    .collection('products')
    .find({ category: slug })
    .limit(50)
    .toArray();

  const safeProducts = initialProducts.map((p) => ({
    ...p,
    _id: p._id?.toString(),
  }));

  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <main className="pt-[5.5rem] min-h-screen bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {categoryName}
      </h1>
      <ProductsPageClient initialProducts={safeProducts} category={slug} />
      {/* SEO Text for the category */}
      <section className="max-w-2xl mx-auto my-10 px-4 text-center text-gray-600">
        <p>
          Discover the best deals in {categoryName}. Shop fresh, high-quality products online and enjoy quick delivery with Jackson Grocery Store in Dehradun.
        </p>
      </section>
      {/* Local business info card (UI only) */}
      <BusinessInfo />
    </main>
  );
}
