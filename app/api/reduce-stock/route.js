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

    // Use session for atomic bulk operation if needed (for multi-item cart)
    // If your MongoDB is replica-set or Atlas, you can enable this for true ACID
    // const session = client.startSession();
    // await session.withTransaction(async () => { ... });

    for (const item of cartItems) {
      let productId = item._id || item.productId || item.id;
      if (typeof productId === 'string' && ObjectId.isValid(productId)) {
        productId = new ObjectId(productId);
      }

      // Always double check positive quantity, safe default
      const quantity = Math.max(Number(item.quantity) || 0, 0);
      if (!quantity) continue;

      // Atomic: only decrement if enough stock, avoid race-conditions/fraud
      const result = await products.updateOne(
        {
          $or: [
            { _id: productId },
            { id: item.id },
            { slug: item.slug }
          ],
          stock: { $gte: quantity }
        },
        { $inc: { stock: -quantity } }
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
    return new Response(JSON.stringify({ error: 'Stock update failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
