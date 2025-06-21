// Route: /api/products/popular  (GET – List popular products, optional: ?skip=0&limit=50)

import mongoose from 'mongoose';
import Product from '../../../lib/models/Product';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = Math.max(Number(searchParams.get('skip') ?? 0), 0);
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100); // Limit to 100 max for perf.

    // MongoDB connection (no connect spam)
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'jackson-grocery-store',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Projection: Only public fields sent to client
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

    // Get popular products, sorted by rank (if exists)
    const products = await Product.find({ isPopular: true }, projection)
      .sort({ rank: 1 }) // Optional: lowest rank first
      .skip(skip)
      .limit(limit)
      .lean();

    // Clean _id
    const safeProducts = products.map(p => ({
      ...p,
      _id: p._id?.toString(),
    }));

    return new Response(JSON.stringify(safeProducts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API][GET /api/products/popular] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch popular products' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
