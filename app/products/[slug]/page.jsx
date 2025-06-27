// /app/products/[slug]/page.jsx

import clientPromise from '../../lib/mongodb';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import { getProductJsonLD } from '../../lib/seo/jsonld';

export const dynamic = 'force-dynamic';

// --- SEO Metadata ---
export async function generateMetadata({ params }) {
  const { slug } = params;
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');
  const product = await db
    .collection('products')
    .findOne(
      { slug },
      { projection: { title: 1, description: 1, image: 1, price: 1, stock: 1, category: 1, mrp: 1 } }
    );
  if (!product) return {};

  const title = `${product.title || 'Product'} - Jackson Grocery Store | Grocery Store Dehradun`;
  const description =
    product.description ||
    'View product details on Jackson Grocery Store. Buy fresh groceries online in Dehradun.';
  const image = product.image || '/images/logo.svg';
  const price = Number(product.price || 0);
  const stock = product.stock ?? 0;

  return {
    title,
    description,
    keywords: `Jackson Grocery Store, Grocery Store Dehradun, Best Grocery Store, Buy groceries online Dehradun, ${product.title}, ${product.category}`,
    alternates: {
      canonical: `https://jackson-grocery.com/products/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://jackson-grocery.com/products/${slug}`,
      type: 'website',
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: product.title || 'Product Image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'ld+json': JSON.stringify(
        getProductJsonLD({
          ...product,
          slug,
          price,
          stock,
          image,
          description,
          title: product.title,
        })
      ),
    },
  };
}

// --- Main SSR Product Page ---
export default async function ProductPage({ params }) {
  const { slug } = params;
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');

  const product = await db.collection('products').findOne(
    { slug },
    {
      projection: {
        title: 1,
        description: 1,
        image: 1,
        price: 1,
        mrp: 1,
        stock: 1,
        category: 1,
        unit: 1,
        pcs: 1,
        rank: 1,
        popular: 1,
        _id: 1,
      },
    }
  );

  if (!product) return notFound();

  const related = await db
    .collection('products')
    .find({ category: product.category, slug: { $ne: slug } })
    .project({
      title: 1,
      image: 1,
      price: 1,
      mrp: 1,
      stock: 1,
      category: 1,
      unit: 1,
      pcs: 1,
      rank: 1,
      popular: 1,
      slug: 1,
      _id: 1,
    })
    .limit(8)
    .toArray();

  const main = {
    ...product,
    _id: product._id?.toString() || '',
  };

  const relatedSafe = related.map((p) => ({
    ...p,
    _id: p._id?.toString() || '',
  }));

  // Pass data to client component for stock sync & UI
  return <ProductDetailClient main={main} relatedSafe={relatedSafe} />;
}
