// Route: /api/products/[slug]  (GET – Get product detail and related products)

import clientPromise from '../../../lib/mongodb';

export async function GET(req, { params }) {
  try {
    const { slug } = params;
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');

    // Find main product
    const product = await db.collection('products').findOne({ slug });
    if (!product) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }

    product._id = product._id.toString();

    // Get related products (same category, different slug)
    const related = await db
      .collection('products')
      .find({ category: product.category, slug: { $ne: slug } })
      .limit(6)
      .toArray();
    related.forEach((r) => (r._id = r._id.toString()));

    return new Response(
      JSON.stringify({ product, related }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[API][GET /api/products/[slug]] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch product' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
