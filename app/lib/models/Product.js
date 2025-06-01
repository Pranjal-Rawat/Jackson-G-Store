// lib/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  category: String,
  price: Number,
  stock: Number,
  image: String, // e.g., "/images/products/apple.jpg"
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
