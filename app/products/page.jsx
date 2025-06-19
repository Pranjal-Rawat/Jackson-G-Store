// Route: /app/products/page.jsx – All products listing (SSR + pagination ready)

import clientPromise from '../lib/mongodb';
import ProductsPageClient from './ProductsPageClient';

export default async function ProductsPage() {
  // --- Fetch initial set of products (limit 50 for performance) ---
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');
  const initialProducts = await db.collection('products').find().limit(50).toArray();

  // --- Normalize Mongo IDs for React compatibility ---
  const safeProducts = initialProducts.map(p => ({
    ...p,
    _id: p._id?.toString(),
  }));

  // --- Render the client component (handles pagination/infinite scroll) ---
  return <ProductsPageClient initialProducts={safeProducts} />;
}
