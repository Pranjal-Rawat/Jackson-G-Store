// Route: Internal – Product Mongoose Model

import mongoose from 'mongoose';

// Helper: Convert "Milk & Juice" → "milk-and-juice"
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[\s_]+/g, '-')      // spaces/underscores → hyphen
    .replace(/[^\w-]+/g, '')      // remove all non-word chars except hyphen
    .replace(/--+/g, '-')         // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');     // trim hyphens
}

// Product schema
const ProductSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  slug:       { type: String, required: true },
  description:{ type: String },
  category:   { type: String, required: true }, // Always slug format
  price:      { type: Number, required: true },
  stock:      { type: Number, default: 0 },
  image:      { type: String },
  isPopular:  { type: Boolean, default: false }, // Add this if you filter by isPopular
  rank:       { type: Number },                  // Optional: for ordering popular products
}, { timestamps: true });

// Auto-slugify slug and category before saving (as fallback)
ProductSchema.pre('save', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = toSlug(this.title);
  }
  if (this.category && /[A-Z ]/.test(this.category)) {
    this.category = toSlug(this.category);
  }
  next();
});

// For Next.js hot reload support
export default mongoose.models?.Product || mongoose.model('Product', ProductSchema);
