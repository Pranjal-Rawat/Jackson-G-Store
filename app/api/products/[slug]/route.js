import clientPromise from '../../../lib/mongodb';
export async function GET(req, { params }) {
  const { slug } = params;
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');

  const product = await db.collection('products').findOne({ slug });
  if (!product) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  product._id = product._id.toString();

  const related = await db
    .collection('products')
    .find({ category: product.category, slug: { $ne: slug } })
    .limit(6)
    .toArray();
  related.forEach((r) => (r._id = r._id.toString()));

  return Response.json({ product, related });
}
