// /app/api/reduce-stock/route.js
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { cartItems } = await request.json();
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const productsCollection = db.collection('products');

    // Deduct stock for each item
    for (const item of cartItems) {
      let productId = item._id || item.productId || item.id;
      if (typeof productId === 'string' && ObjectId.isValid(productId)) {
        productId = new ObjectId(productId);
      }
      await productsCollection.updateOne(
        { $or: [{ _id: productId }, { id: item.id }, { slug: item.slug }] },
        { $inc: { stock: -item.quantity } }
      );
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
