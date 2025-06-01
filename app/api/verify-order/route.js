// app/api/verify-order/route.js
import clientPromise from '@/lib/mongodb'; // Your MongoDB connection helper

export async function POST(request) {
  try {
    const body = await request.json(); 
    // body: { cartItems: [{ productId, quantity }, ...] }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("jackson-grocery-*store"); // Change this to your database name
    const productsCollection = db.collection("products");

    // For each cart item, fetch the latest data from the database.
    const verifiedItems = await Promise.all(
      body.cartItems.map(async (item) => {
        // Here we assume that item.productId is stored as a string
        // Convert to ObjectId if necessary (e.g., using require("mongodb").ObjectId(item.productId))
        const product = await productsCollection.findOne({ _id: item.productId });
        if (!product) throw new Error(`Product ${item.productId} not found`);
        // Return the verified item with recalculated total.
        return {
          ...product,
          quantity: item.quantity,
          total: product.price * item.quantity,
        };
      })
    );

    // Calculate the overall verified total.
    const orderTotal = verifiedItems.reduce((sum, item) => sum + item.total, 0);

    // Construct the order message for WhatsApp.
    const orderMessage = verifiedItems
      .map(item => `${item.title} x${item.quantity} - $${item.total.toFixed(2)}`)
      .join('%0A');
      
    const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Order Details:%0A${orderMessage}%0A%0ATotal: $${orderTotal.toFixed(2)}%0AConfirm Order?`;

    return new Response(JSON.stringify({ whatsappUrl }), { status: 200 });
  } catch (error) {
    console.error("Order verification failed:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}