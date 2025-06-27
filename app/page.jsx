import clientPromise from './lib/mongodb';
import HomeClient from '../components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let safeProducts = [];
  try {
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const products = await db
      .collection('products')
      .find({ $or: [{ popular: true }, { popular: 'true' }] })
      .sort({ rank: 1, _id: 1 })
      .limit(20)
      .toArray();
    safeProducts = products.map((p) => ({
      ...p,
      _id: p._id?.toString(),
    }));
  } catch {
    // fallback handled below
  }

  if (!safeProducts.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-700 bg-white py-16">
        <h1 className="text-2xl font-bold mb-2">Sorry, we’re updating our homepage.</h1>
        <p className="mb-4">Please try again soon.</p>
      </div>
    );
  }

  // Pass only safeProducts to client component
  return <HomeClient products={safeProducts} />;
}
