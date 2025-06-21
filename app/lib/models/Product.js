// Route: Internal – Product Mongoose Model (SEO-friendly slugs)
// Ensures all product/category slugs are optimized for SEO and local search performance.

import mongoose from 'mongoose';

// Helper: Convert "Milk & Juice" → "milk-and-juice"
// Always use lowercase, hyphen-separated slugs for best SEO.
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
  title:      { type: String, required: true },    // Visible SEO keyword
  slug:       { type: String, required: true },    // Used for SEO URLs
  description:{ type: String },                    // SEO meta description
  category:   { type: String, required: true },    // Always slug format for URLs/SEO
  price:      { type: Number, required: true },
  stock:      { type: Number, default: 0 },
  image:      { type: String },                    // Used in OG tags & structured data
  isPopular:  { type: Boolean, default: false },
  rank:       { type: Number },
}, { timestamps: true });

// Auto-slugify slug and category before saving (SEO consistency)
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

/*
  SEO NOTE:
  - All product/category URLs will use optimized, hyphen-case slugs.
  - Consistent slugs across app/SSR/API for maximum search engine clarity.
  - Description and title fields are used for meta tags, structured data, and OpenGraph.
  - Update product titles and categories in the DB for local keyword relevance (e.g., "Dehradun grocery", "Fresh Fruits Dehradun").
*/
