// /app/products/page.jsx – All Products listing

import clientPromise from '../lib/mongodb';
import BusinessInfo from '../../components/BusinessInfo';
import { getCategoryJsonLD } from '../lib/seo/jsonld';
import ProductsPageClient from './client';

export const metadata = {
  title: 'All Products | Jackson Grocery Store | Grocery Store Dehradun',
  description:
    'Browse all products at Jackson Grocery Store in Dehradun. Find fresh groceries, daily essentials, and more. Fast home delivery in Dehradun.',
  keywords:
    'All products, Jackson Grocery Store, Grocery Store Dehradun, Best Grocery Store, Fresh groceries Dehradun, Buy groceries online Dehradun, World of Groceries, Departmental Store Dehradun',
  alternates: {
    canonical: 'https://jackson-grocery.com/products',
  },
  openGraph: {
    title: 'All Products | Jackson Grocery Store | Grocery Store Dehradun',
    description:
      'Browse all groceries, fruits, vegetables, and essentials available at Jackson Grocery Store Dehradun.',
    url: 'https://jackson-grocery.com/products',
    siteName: 'Jackson Grocery Store',
    images: [
      {
        url: 'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png',
        width: 1200,
        height: 630,
        alt: 'Jackson Grocery Store All Products',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Products | Jackson Grocery Store',
    description:
      'Browse all products at Jackson Grocery Store in Dehradun. Find fresh groceries, daily essentials, and more.',
    images: [
      'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png',
    ],
  },
  other: {
    // BreadcrumbList for SEO (Home > All Products)
    'ld+json': JSON.stringify(getCategoryJsonLD({
      categorySlug: 'products',
      categoryName: 'All Products',
    })),
  },
};

export default async function ProductsPage() {
  // --- Fetch initial set of products (limit 50 for performance), sorted by rank ascending ---
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');
  const initialProducts = await db.collection('products')
    .find()
    .sort({ rank: 1 })
    .limit(50)
    .toArray();

  // --- Normalize Mongo IDs for React compatibility ---
  const safeProducts = initialProducts.map(p => ({
    ...p,
    _id: p._id?.toString(),
  }));

  return (
    <>
      {/* Render the client component (handles pagination/infinite scroll) */}
      <ProductsPageClient initialProducts={safeProducts} />
      {/* Local Business Info card (UI only, not <script> tags) */}
      <BusinessInfo />
    </>
  );
}
