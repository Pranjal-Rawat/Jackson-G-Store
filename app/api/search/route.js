// Route: /api/search  (GET – Search products, ?q=term&category=slug)

import clientPromise from '../../lib/mongodb';

// Escape user input to prevent RegExp DoS or injection
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const products = db.collection('products');

    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('q') || '';
    const category = searchParams.get('category');

    const q = escapeRegex(rawQuery.trim());

    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (category) filter.category = category;

    const result = await products.find(filter).limit(20).toArray();

    const formatted = result.map((p) => ({
      _id: p._id?.toString(),
      slug: p.slug,
      title: p.title,
      price: p.price ?? 0,
      image: p.image || '/images/default.jpg',
      description: p.description || '',
    }));

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API][GET /api/search] Error:', error);
    return new Response(JSON.stringify({ error: 'Search failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
