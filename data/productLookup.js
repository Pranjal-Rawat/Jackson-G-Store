// app/data/productLookup.js
// ----------------------------------------------------
//  This helper keeps a lightweight lookup array that
//  every admin page can import for instant suggestions.
//  ----------------------------------------------------

// ✅  Point to the JSON you dropped in /app/data
import products from './cleaned_products.json';

// •  Return only what we need to keep bundle size small
// •  Convert to plain JS array (no Mongo/ObjectId etc.)
const lookup = products.map(p => ({
  title: p.title?.trim() ?? '',
  slug : p.slug  ?? '',
}));

export default lookup;
