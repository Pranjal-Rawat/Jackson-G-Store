import mongoose from 'mongoose';
import Product from '../../lib/models/Product';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = Math.max(Number(searchParams.get('skip')) || 0, 0);
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'jackson-grocery-store',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

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

    const filter = {};
    if (category) filter.category = new RegExp(`^${category}$`, 'i');
    if (search) filter.title = { $regex: search, $options: 'i' };

    const products = await Product.find(filter, projection)
      .sort({ rank: 1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const safeProducts = products.map((p) => ({
      ...p,
      _id: p._id?.toString(),
    }));

    return new Response(JSON.stringify(safeProducts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
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
