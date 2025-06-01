// app/api/whatsapp/route.js
export async function POST(request) {
  const { items } = await request.json();
  // Build the WhatsApp message from the cart items.
  const message = items
    .map(item => `${item.title} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  return Response.json({
    url: `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  });
}