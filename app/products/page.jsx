// /app/products/page.jsx – Server-rendered Products Page

import clientPromise from '../lib/mongodb';
import ProductsPageClient from './client';
import BusinessInfo from '../../components/BusinessInfo';
import { getCategoryJsonLD } from '../lib/seo/jsonld';

export const dynamic = 'force-dynamic'; // Always render latest products on each request

export const metadata = {
  title: 'All Products | Jackson Grocery Store | Grocery Store Dehradun',
  description: 'Browse all products at Jackson Grocery Store in Dehradun. Find fresh groceries, daily essentials, and more. Fast home delivery in Dehradun.',
  keywords: 'All products, Jackson Grocery Store, Grocery Store Dehradun, Best Grocery Store, Fresh groceries Dehradun, Buy groceries online Dehradun, World of Groceries, Departmental Store Dehradun',
  alternates: {
    canonical: 'https://jackson-grocery.com/products',
  },
  openGraph: {
    title: 'All Products | Jackson Grocery Store | Grocery Store Dehradun',
    description: 'Browse all groceries, fruits, vegetables, and essentials available at Jackson Grocery Store Dehradun.',
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
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Products | Jackson Grocery Store',
    description: 'Browse all products at Jackson Grocery Store in Dehradun. Find fresh groceries, daily essentials, and more.',
    images: [
      'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png',
    ],
  },
  other: {
    'ld+json': JSON.stringify(
      getCategoryJsonLD({
        categorySlug: 'products',
        categoryName: 'All Products',
      })
    ),
  },
};

export default async function ProductsPage() {
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');

  const initialProducts = await db
    .collection('products')
    .find({})
    .sort({ rank: 1 })
    .limit(50)
    .toArray();

  const safeProducts = initialProducts.map((product) => ({
    ...product,
    _id: product._id.toString(),
  }));

  return (
    <>
      <ProductsPageClient initialProducts={safeProducts} />
      <BusinessInfo />
    </>
  );
}
