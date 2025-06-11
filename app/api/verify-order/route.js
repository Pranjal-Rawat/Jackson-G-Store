// app/api/checkout/route.js (or your current filename)
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const productsCollection = db.collection('products');

    // Accept both `productId` as a string and as Mongo ObjectId
    const verifiedItems = await Promise.all(
      body.cartItems.map(async (item) => {
        // Try matching with _id (if sent), or fallback to your own id/slug field
        let product;
        if (item._id) {
          product = await productsCollection.findOne({ _id: new ObjectId(item._id) });
        }
        if (!product && item.productId) {
          // fallback, if you use a custom 'id' or 'slug' field
          product = await productsCollection.findOne({ id: item.productId });
        }
        if (!product && item.slug) {
          product = await productsCollection.findOne({ slug: item.slug });
        }
        if (!product) throw new Error(`Product ${item.productId || item.slug || item._id} not found`);

        return {
          title: product.title,
          price: product.price,
          quantity: item.quantity,
          total: product.price * item.quantity,
        };
      })
    );

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
    console.error('Order verification failed:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
