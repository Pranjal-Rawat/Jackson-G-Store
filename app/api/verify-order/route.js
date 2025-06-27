// Route: /api/verify-order (POST – Verify cart, reduce stock, generate WhatsApp link)
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const body = await request.json();

    // Input validation
    if (!body.cartItems?.length || !Array.isArray(body.cartItems)) {
      return new Response(JSON.stringify({ error: 'Cart is empty.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }
    if (!body.customer || typeof body.customer !== 'object') {
      return new Response(JSON.stringify({ error: 'Missing customer details.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const products = db.collection('products');
    const verifiedItems = [];
    const outOfStock = [];

    // --- Double-check all items before mutating stock ---
    for (const item of body.cartItems) {
      // Safe id detection
      const query =
        item._id && ObjectId.isValid(item._id)
          ? { _id: new ObjectId(item._id) }
          : item.productId
          ? { id: item.productId }
          : item.slug
          ? { slug: item.slug }
          : null;
      if (!query) {
        outOfStock.push({ ...item, reason: 'Missing identifier' });
        continue;
      }

      const product = await products.findOne(query);
      if (!product) {
        outOfStock.push({ ...item, reason: 'Not found' });
        continue;
      }
      if (typeof product.stock !== 'number' || product.stock < item.quantity) {
        outOfStock.push({ ...item, title: product.title, reason: 'Insufficient stock' });
        continue;
      }

      const price = typeof product.price === 'number' ? product.price : 0;
      const total = +(price * item.quantity).toFixed(2);

      verifiedItems.push({
        _id: product._id,
        title: product.title,
        price,
        quantity: item.quantity,
        total,
      });
    }

    if (outOfStock.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Some items are out of stock.', outOfStock }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        }
      );
    }

    // --- Reduce stock atomically ---
    for (const item of verifiedItems) {
      const result = await products.updateOne(
        { _id: new ObjectId(item._id), stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (result.modifiedCount === 0) {
        // Rare: lost the race, item went out of stock after verify step
        outOfStock.push({ ...item, reason: 'Stock changed during checkout' });
      }
    }

    if (outOfStock.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Some items went out of stock during checkout.', outOfStock }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
        }
      );
    }

    // --- WhatsApp message formatting ---
    const orderTotal = verifiedItems.reduce((sum, item) => sum + item.total, 0).toFixed(2);
    const orderLines = verifiedItems
      .map(item => `${item.title} x${item.quantity} – ₹${item.total.toFixed(2)}`)
      .join('%0A');

    const customer = body.customer;
    const customerDetails =
      `Name: ${customer.name || ''}%0A` +
      `Phone: ${customer.phone || ''}%0A` +
      `Address: ${customer.address || ''}`;

    const message = `Order Details:%0A${orderLines}%0A%0ATotal: ₹${orderTotal}%0A%0A${customerDetails}%0A%0AConfirm Order?`;
    const phoneNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917417229660'; // fallback if env missing
    const whatsappUrl = `https://wa.me/${phoneNum}?text=${encodeURIComponent(message)}`;

    return new Response(JSON.stringify({ whatsappUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });

  } catch (error) {
    console.error('[API][POST /api/verify-order] Error:', error);
    return new Response(JSON.stringify({ error: 'Order verification failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  }
}
