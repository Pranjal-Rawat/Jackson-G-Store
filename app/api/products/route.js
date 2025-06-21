// Route: /api/products  (GET – List products, optional: ?category=fruits&skip=0&limit=50)

import mongoose from 'mongoose';
import Product from '../../lib/models/Product';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = Math.max(Number(searchParams.get('skip')) || 0, 0);
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100); // limit max to 100
    const category = searchParams.get('category');

    // MongoDB connection (avoid connect spam)
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'jackson-grocery-store',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Only public fields sent to client
    const projection = {
      _id: 1,
      slug: 1,
      title: 1,
      image: 1,
      price: 1,
      stock: 1,
      category: 1,
      rank: 1,
    };

    // Filter: category is already a slug in your schema
    const filter = category ? { category } : {};

    // Query products
    const products = await Product.find(filter, projection)
      .skip(skip)
      .limit(limit)
      .lean();

    // Ensure _id is string for Next.js
    const safeProducts = products.map((p) => ({
      ...p,
      _id: p._id?.toString(),
    }));

    return new Response(JSON.stringify(safeProducts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API][GET /api/products] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch products' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
