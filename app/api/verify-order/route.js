import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("jackson-grocery-store");
    const productsCollection = db.collection("products");

    const verifiedItems = await Promise.all(
      body.cartItems.map(async (item) => {
        const product = await productsCollection.findOne({ id: item.productId });

        if (!product) throw new Error(`Product ${item.productId} not found`);
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

    return new Response(JSON.stringify({ whatsappUrl }), { status: 200 });
  } catch (error) {
    console.error("Order verification failed:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}