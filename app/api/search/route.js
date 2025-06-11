// app/api/search/route.js
import clientPromise from '../../lib/mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const productsCollection = db.collection('products');

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category');

    // Build MongoDB search filter
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (category) filter.category = category; // category slug

    const products = await productsCollection
      .find(filter)
      .limit(20)
      .toArray();

    // Normalize for frontend use
    const normalized = products.map(p => ({
      _id: p._id.toString(),
      slug: p.slug,
      title: p.title,
      price: p.price || 0,
      image: p.image || '/images/default.jpg',
      description: p.description || '',
    }));

    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return new Response(JSON.stringify({ error: 'Search failed' }), {
      status: 500,
    });
  }
}
