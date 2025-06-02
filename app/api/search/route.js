// app/api/search/route.js
import clientPromise from '../../lib/mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const productsCollection = db.collection('products');

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    const products = await productsCollection
      .find({ "Product Name": { $regex: q, $options: 'i' } })
      .limit(20)
      .toArray();

    // Normalize fields for frontend
    const normalized = products.map((p) => ({
      _id: p._id,
      slug: p.slug,
      title: p['Product Name'],
      price: p.Price || 0,
      image: p.image || '/images/default.jpg', // fallback if no image
      description: p.Description || '',
    }));

    return new Response(JSON.stringify(normalized), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

