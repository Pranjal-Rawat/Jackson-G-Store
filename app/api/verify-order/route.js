// Route: /api/verify-order  (POST – Verify cart, check stock, reduce stock, create WhatsApp order link)

import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const body = await request.json();

    // Input validation
    if (!body.cartItems || !Array.isArray(body.cartItems) || body.cartItems.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty.' }), { status: 400 });
    }
    if (!body.customer || typeof body.customer !== 'object') {
      return new Response(JSON.stringify({ error: 'Missing customer details.' }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const productsCollection = db.collection('products');

    // 1. Verify stock and build order summary
    const verifiedItems = [];
    const outOfStock = [];

    for (const item of body.cartItems) {
      let product = null;
      if (item._id && ObjectId.isValid(item._id)) {
        product = await productsCollection.findOne({ _id: new ObjectId(item._id) });
      }
      if (!product && item.productId) {
        product = await productsCollection.findOne({ id: item.productId });
      }
      if (!product && item.slug) {
        product = await productsCollection.findOne({ slug: item.slug });
      }
      if (!product) {
        outOfStock.push({ ...item, reason: 'Not found' });
        continue;
      }
      if (typeof product.stock === 'number' && product.stock < item.quantity) {
        outOfStock.push({ ...item, title: product.title, reason: 'Insufficient stock' });
        continue;
      }
      verifiedItems.push({
        _id: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity,
      });
    }

    if (outOfStock.length > 0) {
      return new Response(JSON.stringify({ error: 'Some items are out of stock.', outOfStock }), { status: 409 });
    }

    // 2. Atomic reduce stock for each product
    for (const item of verifiedItems) {
      await productsCollection.updateOne(
        { _id: new ObjectId(item._id), stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
    }

    // 3. WhatsApp order message with customer details
    const orderTotal = verifiedItems.reduce((sum, item) => sum + item.total, 0);
    const orderLines = verifiedItems
      .map(item => `${item.title} x${item.quantity} - ₹${item.total}`)
      .join('%0A');

    const customer = body.customer || {};
    const customerDetails =
      `Name: ${customer.name || ''}%0A` +
      `Phone: ${customer.phone || ''}%0A` +
      `Address: ${customer.address || ''}%0A`;

    const whatsappMsg = 
      `Order Details:%0A${orderLines}%0A%0ATotal: ₹${orderTotal}%0A%0A${customerDetails}Confirm Order?`;

    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${whatsappMsg}`;

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
