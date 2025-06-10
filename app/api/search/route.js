// app/api/search/route.js
import clientPromise from '../../lib/mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const productsCollection = db.collection('products');

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    // UPDATED: search on 'title', not 'Product Name'
    const products = await productsCollection
      .find({ title: { $regex: q, $options: 'i' } })
      .limit(20)
      .toArray();

    // UPDATED: use correct field names
    const normalized = products.map(p => ({
      _id: p._id,
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
