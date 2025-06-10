import mongoose from 'mongoose';
import Product from '../../../lib/models/Product';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = Number(searchParams.get('skip') ?? 0);
    const limit = Number(searchParams.get('limit') ?? 50);

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'jackson-grocery-store',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Only fetch popular products
    const products = await Product.find({ isPopular: true })
      .skip(skip)
      .limit(limit)
      .lean();

    const safeProducts = products.map((p) => ({
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
