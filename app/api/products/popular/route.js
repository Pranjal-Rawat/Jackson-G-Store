// Route: /api/products/popular  (GET – List popular products, optional: ?skip=0&limit=50)
import mongoose from 'mongoose';
import Product from '../../../lib/models/Product';

// Allow only GET requests, secure/optimized
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = Math.max(Number(searchParams.get('skip')) || 0, 0);
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100); // Max 100

    // Prevent multiple mongoose connects in dev/hot reload
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'jackson-grocery-store',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Only send minimal, public fields for UI
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

    // Consistent "popular" key for legacy/future proofing
    const filter = { $or: [{ isPopular: true }, { popular: true }, { popular: 'true' }] };

    // Mongo query: lean for speed, sorted by rank
    const products = await Product.find(filter, projection)
      .sort({ rank: 1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Clean ObjectId
    const safeProducts = products.map(p => ({
      ...p,
      _id: p._id?.toString(),
    }));

    return new Response(JSON.stringify(safeProducts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Edge/CDN cache (if allowed in your infra)
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
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
