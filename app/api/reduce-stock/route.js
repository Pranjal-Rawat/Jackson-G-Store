// Route: /api/reduce-stock  (POST – Reduce stock for each product in cart)

import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { cartItems } = await request.json();

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid cart items.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const products = db.collection('products');
    const understocked = [];

    for (const item of cartItems) {
      let productId = item._id || item.productId || item.id;
      if (typeof productId === 'string' && ObjectId.isValid(productId)) {
        productId = new ObjectId(productId);
      }

      const result = await products.updateOne(
        {
          $or: [
            { _id: productId },
            { id: item.id },
            { slug: item.slug }
          ],
          stock: { $gte: item.quantity }
        },
        { $inc: { stock: -item.quantity } }
      );

      if (result.matchedCount === 0) {
        understocked.push(item);
      }
    }

    if (understocked.length > 0) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'Some items had insufficient stock.',
        understocked
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[API][POST /api/reduce-stock] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
