// Route: /api/products  (GET – List products, optional: ?category=fruits&skip=0&limit=50)
import mongoose from 'mongoose';
import Product from '../../lib/models/Product';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = Math.max(Number(searchParams.get('skip')) || 0, 0);
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Prevent multiple connections on dev/hot-reload
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'jackson-grocery-store',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Only public fields
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

    // Flexible filter: supports category, search, or both
    const filter = {};
    if (category) filter.category = new RegExp(`^${category}$`, 'i');
    if (search) filter.title = { $regex: search, $options: 'i' };

    // Query
    const products = await Product.find(filter, projection)
      .sort({ rank: 1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Clean _id
    const safeProducts = products.map((p) => ({
      ...p,
      _id: p._id?.toString(),
    }));

    // Edge-cache (for SSR and Vercel/Netlify)
    return new Response(JSON.stringify(safeProducts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 1 minute, serve stale for another 2 minutes (tweak for your business)
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
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
