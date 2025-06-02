// app/products/[slug]/page.jsx
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');

  const product = await db.collection('products').findOne({ slug: params.slug });

  return product
    ? {
        title: `${product['Product Name']} - Jackson Grocery`,
        description: product.Description || '',
      }
    : {};
}

export default async function ProductPage({ params }) {
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');

  const product = await db.collection('products').findOne({ slug: params.slug });

  if (!product) return notFound();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{product['Product Name']}</h1>
      <p className="text-lg text-gray-700 mt-4">{product.Description}</p>
      <p className="text-xl text-red-600 font-semibold mt-2">₹{product.Price}</p>
    </div>
  );
}