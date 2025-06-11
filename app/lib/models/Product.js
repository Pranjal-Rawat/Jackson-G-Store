import mongoose from 'mongoose';

// Helper: Converts "Milk & Juice" → "milk-and-juice"
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[\s_]+/g, '-')    // spaces/underscores → hyphen
    .replace(/[^\w-]+/g, '')    // remove all non-word chars except hyphen
    .replace(/--+/g, '-')       // collapse multiple hyphens
    .replace(/^-+|-+$/g, '');   // trim hyphens
}

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: String,
  category: { type: String, required: true }, // This is the category SLUG!
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: String,
});

// Auto-slugify product slug and category on save (as a last defense)
ProductSchema.pre('save', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = toSlug(this.title);
  }
  if (this.category && /[A-Z ]/.test(this.category)) {
    this.category = toSlug(this.category);
  }
  next();
});

export default mongoose.models?.Product || mongoose.model('Product', ProductSchema);
