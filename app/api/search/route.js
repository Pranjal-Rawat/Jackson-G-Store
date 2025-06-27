// Route: /api/search  (GET – Search products, ?q=term&category=slug)
// Route: /api/search?q=term&category=slug
import clientPromise from '../../lib/mongodb';

// Escape regex safely to avoid injection or ReDoS
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const products = db.collection('products');

    const { searchParams } = new URL(request.url);
    const rawQuery = (searchParams.get('q') || '').trim().slice(0, 64); // Max 64 chars
    const category = searchParams.get('category');

    // Early exit for short/invalid queries
    if (!rawQuery || rawQuery.length < 2) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const q = escapeRegex(rawQuery);
    const filter = { title: { $regex: q, $options: 'i' } };
    if (category) filter.category = category;

    const projection = {
      _id: 1,
      slug: 1,
      title: 1,
      price: 1,
      image: 1,
      description: 1,
    };

    const result = await products
      .find(filter, { projection })
      .sort({ rank: 1, title: 1 })
      .limit(20)
      .toArray();

    const formatted = result.map((p) => ({
      _id: p._id?.toString() || '',
      slug: p.slug,
      title: p.title,
      price: typeof p.price === 'number' ? p.price : 0,
      image: p.image || '/images/logo.svg',
      description: p.description || '',
    }));

    return new Response(JSON.stringify(formatted), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=90',
        'Vary': 'Accept-Encoding',
      },
    });
  } catch (error) {
    console.error('[API][GET /api/search] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Search failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
