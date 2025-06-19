// Route: /api/verify-order  (POST – Verify cart, check stock, reduce stock, create WhatsApp order link)

import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const productsCollection = db.collection('products');

    // 1. Verify all cart items and check stock
    const verifiedItems = await Promise.all(
      body.cartItems.map(async (item) => {
        let product = null;
        if (item._id) {
          product = await productsCollection.findOne({ _id: new ObjectId(item._id) });
        }
        if (!product && item.productId) {
          product = await productsCollection.findOne({ id: item.productId });
        }
        if (!product && item.slug) {
          product = await productsCollection.findOne({ slug: item.slug });
        }
        if (!product) throw new Error(`Product ${item.productId || item.slug || item._id} not found`);

        // Stock check
        if (typeof product.stock === 'number' && product.stock < item.quantity) {
          throw new Error(`"${product.title}" is out of stock or not enough quantity`);
        }

        return {
          _id: product._id,
          title: product.title,
          price: product.price,
          quantity: item.quantity,
          total: product.price * item.quantity,
        };
      })
    );

    // 2. Reduce stock for each product
    await Promise.all(
      verifiedItems.map(async (item) => {
        await productsCollection.updateOne(
          { _id: new ObjectId(item._id) },
          { $inc: { stock: -item.quantity } }
        );
      })
    );

    // 3. Create WhatsApp order message
    const orderTotal = verifiedItems.reduce((sum, item) => sum + item.total, 0);
    const orderMessage = verifiedItems
      .map(item => `${item.title} x${item.quantity} - ₹${item.total}`)
      .join('%0A');
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Order Details:%0A${orderMessage}%0A%0ATotal: ₹${orderTotal}%0AConfirm Order?`;

    return new Response(JSON.stringify({ whatsappUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[API][POST /api/verify-order] Order verification failed:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
