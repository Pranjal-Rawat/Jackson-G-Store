// Route: /api/products/[slug]  (GET – Get product detail and related products)
import clientPromise from '../../../lib/mongodb';

// Use standard Next.js API Response helpers for best SSR performance
export async function GET(req, { params }) {
  try {
    const { slug } = params;
    if (!slug || typeof slug !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid product slug' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');

    // Main product: only fetch fields you show publicly
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
          options: 1,
        },
      }
    );

    if (!product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    product._id = product._id.toString();

    // Related products: only fetch small set of fields, limit to 6
    const related = await db
      .collection('products')
      .find({ category: product.category, slug: { $ne: slug } })
      .project({
        _id: 1,
        slug: 1,
        title: 1,
        image: 1,
        price: 1,
        stock: 1,
        category: 1,
      })
      .limit(6)
      .toArray();

    // Convert ObjectId to string for all related
    for (const r of related) r._id = r._id.toString();

    // Defensive: Never leak extra data!
    return new Response(
      JSON.stringify({ product, related }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' } }
    );
  } catch (error) {
    console.error('[API][GET /api/products/[slug]] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch product' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
