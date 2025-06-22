// Route: /api/products/[slug]  (GET – Get product detail and related products)

import clientPromise from '../../../lib/mongodb';

export async function GET(req, { params }) {
  try {
    const { slug } = params;
    if (!slug) {
      return new Response(
        JSON.stringify({ error: 'Missing product slug' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');

    // Fetch main product (only public fields)
    const product = await db.collection('products').findOne(
      { slug },
      {
        projection: {
          _id: 1,
          slug: 1,
          title: 1,
          image: 1,
          price: 1,
          stock: 1,
          description: 1,
          category: 1,
          options: 1
        }
      }
    );
    if (!product) {
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    product._id = product._id.toString();

    // Fetch related products
    const related = await db.collection('products')
      .find({ category: product.category, slug: { $ne: slug } })
      .project({
        _id: 1,
        slug: 1,
        title: 1,
        image: 1,
        price: 1,
        stock: 1,
        category: 1
      })
      .limit(6)
      .toArray();

    related.forEach(r => { r._id = r._id.toString(); });

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
