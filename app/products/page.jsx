// /app/products/page.jsx
import clientPromise from '../lib/mongodb';
import ProductsPageClient from './ProductsPageClient';

export default async function ProductsPage() {
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');
  const initialProducts = await db.collection('products').find().limit(50).toArray();
  const safeProducts = initialProducts.map(p => ({
    ...p,
    _id: p._id?.toString(),
  }));

  return <ProductsPageClient initialProducts={safeProducts} />;
}
