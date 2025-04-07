// app/products/[slug]/page.jsx
import { notFound } from 'next/navigation';
import { products } from '@/data/products';

export async function generateMetadata({ params }) {
  const product = products.find(p => p.slug === params.slug);
  return product ? {
    title: `${product.title} - Grocery Store`,
    description: product.description,
  } : {};
}

export default function ProductPage({ params }) {
  const product = products.find(p => p.slug === params.slug);

  if (!product) return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Product details implementation */}
    </div>
  );
}