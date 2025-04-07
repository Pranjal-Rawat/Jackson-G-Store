// app/api/whatsapp/route.js
export async function POST(request) {
    const { items } = await request.json();
    
    // Generate WhatsApp message
    const message = items.map(item => 
      `${item.title} x${item.quantity} - $${item.price * item.quantity}`
    ).join('\n');
  
    return Response.json({
      url: `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    });
  }