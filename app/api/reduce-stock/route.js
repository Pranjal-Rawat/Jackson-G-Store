// Route: /api/reduce-stock  (POST – Reduce stock for each product in cart)

import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { cartItems } = await request.json();
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const productsCollection = db.collection('products');

    // Deduct stock for each item; ensure stock doesn't go below zero
    for (const item of cartItems) {
      let productId = item._id || item.productId || item.id;
      if (typeof productId === 'string' && ObjectId.isValid(productId)) {
        productId = new ObjectId(productId);
      }
      await productsCollection.updateOne(
        {
          $or: [
            { _id: productId },
            { id: item.id },
            { slug: item.slug }
          ],
          stock: { $gte: item.quantity } // Only reduce if enough stock
        },
        { $inc: { stock: -item.quantity } }
      );
      // Optionally, you can check if matchedCount === 0 and collect understocked items for error reporting.
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
