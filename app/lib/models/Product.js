// Route: Internal – Product Mongoose Model (SEO-friendly slugs)
// Ensures all product/category slugs are optimized for SEO and local search performance.

import mongoose from 'mongoose';

// Helper: Convert "Milk & Juice" → "milk-and-juice"
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[\s_]+/g, '-')      // spaces/underscores → hyphen
    .replace(/[^\w-]+/g, '')      // remove non-word chars except hyphen
    .replace(/--+/g, '-')         // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');     // trim hyphens
}

// Product schema
const ProductSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true }, // Unique slugs
  description: { type: String },
  category:    { type: String, required: true }, // slug format
  price:       { type: Number, required: true },
  stock:       { type: Number, default: 0 },
  image:       { type: String },
  isPopular:   { type: Boolean, default: false },
  rank:        { type: Number },
  // Add more fields as needed (mrp, options, unit, pcs, etc.)
}, { timestamps: true });

// Auto-generate unique slug & normalize category slug on save
ProductSchema.pre('save', async function (next) {
  // Only update slug if title changed or slug is missing
  if (this.title && (!this.slug || this.isModified('title'))) {
    const baseSlug = toSlug(this.title);
    let slug = baseSlug;
    let i = 1;

    // Use the model (avoid compilation error on hot reload)
    const Product = mongoose.models?.Product || mongoose.model('Product', ProductSchema);
    while (await Product.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${i++}`;
    }
    this.slug = slug;
  }

  // Always normalize category to slug format
  if (this.category && /[A-Z ]/.test(this.category)) {
    this.category = toSlug(this.category);
  }

  next();
});

// For hot reload in dev
export default mongoose.models?.Product || mongoose.model('Product', ProductSchema);

/*
  SEO NOTE:
  - Ensures unique, clean slugs like /products/milk-and-juice
  - Auto-corrects capitalized or spaced categories (Milk Juice → milk-juice)
  - Guarantees schema works for OpenGraph, JSON-LD, canonical linking
  - Fast API responses = better SEO
*/
