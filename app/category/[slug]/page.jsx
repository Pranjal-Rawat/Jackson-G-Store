// app/category/[slug]/page.jsx

import clientPromise from '../../lib/mongodb';
import ProductsPageClient from '../../products/ProductsPageClient'

export default async function CategoryPage({ params }) {
  // Await params if required by your Next.js version
  const { slug } = await params;

  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');

  // Fetch first 50 products for the selected category
  const initialProducts = await db
    .collection('products')
    .find({ category: slug })
    .limit(50)
    .toArray();

  const safeProducts = initialProducts.map((p) => ({
    ...p,
    _id: p._id?.toString(),
  }));

  return (
    <ProductsPageClient
      initialProducts={safeProducts}
      category={slug}
    />
  );
}
