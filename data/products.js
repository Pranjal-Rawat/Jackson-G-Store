// /data/products.js

import babyCare from './baby_care_products.js';
import beverages from './beverages_products.js';
import condimentsSauces from './condiments_sauces_products.js';
import dairyRefrigerated from './dairy_refrigerated_products.js';
import householdCleaning from './household_cleaning_products.js';
import personalCare from './personal_care_products.js';
import snacksBakery from './snacks_bakery_products.js';
import spicesMasalas from './spices_masalas_products.js';
import staples from './staples_products.js';

const products = [
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

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

products.forEach(product => {
  if (product.category) product.category = toSlug(product.category);
  if (!product.name) {
    product.name = product.title || '';
  }
});

export default products;

// import babyCare from './baby_care_products.js';
// import beverages from './beverages_products.js';
// import condimentsSauces from './condiments_sauces_products.js';
// import dairyRefrigerated from './dairy_refrigerated_products.js';
// import householdCleaning from './household_cleaning_products.js';
// import personalCare from './personal_care_products.js';
// import snacksBakery from './snacks_bakery_products.js';
// import spicesMasalas from './spices_masalas_products.js';
// import staples from './staples_products.js';

// // Combine all into one array
// const products = [
//   ...babyCare,
//   ...beverages,
//   ...condimentsSauces,
//   ...dairyRefrigerated,
//   ...householdCleaning,
//   ...personalCare,
//   ...snacksBakery,
//   ...spicesMasalas,
//   ...staples,
// ];

// // Optional: If you want to ensure all category fields are slugified, add this!
// function toSlug(str) {
//   return str
//     .toLowerCase()
//     .replace(/&/g, 'and')
//     .replace(/[\s_]+/g, '-')
//     .replace(/[^\w-]+/g, '')
//     .replace(/--+/g, '-')
//     .replace(/^-+|-+$/g, '');
// }

// products.forEach(product => {
//   if (product.category) {
//     product.category = toSlug(product.category);
//   }
//   if (!product.name) {
//     product.name = product.title || '';
//   }
// });

// export default products;

