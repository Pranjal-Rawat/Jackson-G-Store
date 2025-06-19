import fs from 'fs';
import babyCare from '../data/baby_care_products.js';
import beverages from '../data/beverages_products.js';
import condimentsSauces from '../data/condiments_sauces_products.js';
import dairyRefrigerated from '../data/dairy_refrigerated_products.js';
import householdCleaning from '../data/household_cleaning_products.js';
import personalCare from '../data/personal_care_products.js';
import snacksBakery from '../data/snacks_bakery_products.js';
import spicesMasalas from '../data/spices_masalas_products.js';
import staples from '../data/staples_products.js';

// Combine all category files
const allProducts = [
  ...babyCare,
  ...beverages,
  ...condimentsSauces,
  ...dairyRefrigerated,
  ...householdCleaning,
  ...personalCare,
  ...snacksBakery,
  ...spicesMasalas,
  ...staples,
];

// Slugify helper for category
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Clean up each product
allProducts.forEach((product) => {
  product.category = toSlug(product.category || '');
  product.name = product.name || product.title || '';
  product.image = product.image || `/images/products/${product.category}.webp`;
});

// Write to JSON file
fs.writeFileSync(
  './data/products_with_images.json',
  JSON.stringify(allProducts, null, 2)
);

console.log(`✅ Combined and saved ${allProducts.length} products to /data/products_with_images.json`);
