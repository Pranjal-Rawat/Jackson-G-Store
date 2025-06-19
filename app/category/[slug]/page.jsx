// Route: /app/category/[slug]/page.jsx – Category product listing (SSR & SEO)
// SEO: Dynamic meta, OG, Twitter, JSON-LD schema

import clientPromise from '../../lib/mongodb';
import ProductsPageClient from '../../products/ProductsPageClient';

export async function generateMetadata({ params }) {
  const categorySlug = params.slug;
  // Human-readable name (capitalize, replace dashes)
  const categoryTitle = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const title = `${categoryTitle} – Buy Online | Jackson Grocery`;
  const description = `Shop for ${categoryTitle} and other groceries online at Jackson Grocery. Best prices, fast delivery, and fresh products.`;
  const url = `https://yourdomain.com/category/${categorySlug}`;
  const ogImage = 'https://yourdomain.com/og-image.jpg'; // Change to category-specific if you have

  return {
    title,
    description,
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
    }
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
  const canonicalUrl = `https://yourdomain.com/category/${slug}`;

  // --- JSON-LD Structured Data (Category/Breadcrumb) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": categoryName,
    "description": `All products in ${categoryName}`,
    "url": canonicalUrl,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://yourdomain.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": categoryName,
          "item": canonicalUrl
        }
      ]
    }
  };

  return (
    <main className="pt-[5.5rem] min-h-screen bg-white">
      {/* --- SEO Structured Data (inject in <head>) --- */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {categoryName}
      </h1>
      <ProductsPageClient initialProducts={safeProducts} category={slug} />
      {/* SEO Text for the category */}
      <section className="max-w-2xl mx-auto my-10 px-4 text-center text-gray-600">
        <p>
          Discover the best deals in {categoryName}. Shop fresh, high-quality products online and enjoy quick delivery with Jackson Grocery.
        </p>
      </section>
    </main>
  );
}
