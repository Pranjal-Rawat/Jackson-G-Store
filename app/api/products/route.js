import mongoose from 'mongoose';
import Product from '../../lib/models/Product';

// GET /api/products?category=fruits&skip=50&limit=50
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = Number(searchParams.get('skip') || 0);
    const limit = Number(searchParams.get('limit') || 50);
    const category = searchParams.get('category');

    // Ensure MongoDB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'jackson-grocery-store',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Always filter by slug (your category is slugified)
    const filter = category ? { category } : {};

    // Get products
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .lean();

    // Ensure _id is string (for Next.js/React)
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