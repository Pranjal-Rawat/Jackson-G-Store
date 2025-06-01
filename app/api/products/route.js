// app/api/products/route.js
import mongoose from "mongoose";
import Product from "@/lib/models/Product";

export async function GET() {
  try {
    // Connect Mongoose to MongoDB if not already connected.
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Fetch all products using Mongoose
    const products = await Product.find({});

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), { status: 500 });
  }
}