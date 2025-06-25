// Route: /api/products/[slug]
import clientPromise from '../../../lib/mongodb';

export async function GET(req, { params }) {
  try {
    const { slug } = params;

    if (!slug || typeof slug !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid slug' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');

    // Fetch main product details
    const product = await db.collection('products').findOne(
      { slug },
      {
        projection: {
          _id: 1,
          slug: 1,
          title: 1,
          image: 1,
          price: 1,
          mrp: 1,
          stock: 1,
          description: 1,
          category: 1,
          options: 1,
          unit: 1,
          pcs: 1,
          quantity: 1,
          pieces: 1,
        },
      }
    );

    if (!product) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert _id to string
    product._id = product._id.toString();

    // Fetch related products (same category, different slug)
    const related = await db
      .collection('products')
      .find({
        category: product.category,
        slug: { $ne: slug },
      })
      .project({
        _id: 1,
        slug: 1,
        title: 1,
        image: 1,
        price: 1,
        mrp: 1,
        stock: 1,
        unit: 1,
        pcs: 1,
        quantity: 1,
        pieces: 1,
      })
      .limit(6)
      .toArray();

    // Convert _id to string for related items
    related.forEach((r) => (r._id = r._id.toString()));

    return new Response(
      JSON.stringify({ product, related }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('[API][GET /api/products/[slug]]:', error);
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
