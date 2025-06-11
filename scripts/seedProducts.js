// scripts/seedProducts.js

import 'dotenv/config';
import clientPromise from '../app/lib/mongodb.js';
import productsRaw from '../data/products.js';
import categories from '../data/categories.js';

// Helper: Converts "Milk & Juice" → "milk-and-juice"
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// 1. Prepare products with slugified category field
const products = productsRaw.map((product) => ({
  ...product,
  category: product.category ? toSlug(product.category) : '',
}));

async function seedData() {
  let client;
  try {
    client = await clientPromise;
    const db = client.db('jackson-grocery-store');

    // Clear old products and categories
    const deleteProductsResult = await db.collection('products').deleteMany();
    console.log(`🗑️ Deleted ${deleteProductsResult.deletedCount} existing products.`);

    const deleteCategoriesResult = await db.collection('categories').deleteMany();
    console.log(`🗑️ Deleted ${deleteCategoriesResult.deletedCount} existing categories.`);

    // Insert new products and categories
    const insertProductsResult = await db.collection('products').insertMany(products);
    console.log(`🌱 Seeded ${insertProductsResult.insertedCount} products.`);

    const insertCategoriesResult = await db.collection('categories').insertMany(categories);
    console.log(`🌱 Seeded ${insertCategoriesResult.insertedCount} categories.`);

    // 2. Cleanup pass: fix any products that might have legacy/incorrect category field
    const allProducts = await db.collection('products').find({}).toArray();
    let fixedCount = 0;
    for (const prod of allProducts) {
      const slugged = toSlug(prod.category);
      if (prod.category !== slugged) {
        await db.collection('products').updateOne(
          { _id: prod._id },
          { $set: { category: slugged } }
        );
        fixedCount++;
        console.log(`🔧 Fixed legacy product: ${prod.title} → ${slugged}`);
      }
    }
    if (fixedCount) {
      console.log(`✅ ${fixedCount} legacy product(s) had their category slugified post-seed.`);
    }

    // Graceful close
    await client.close();
    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    if (client) await client.close();
    process.exit(1);
  }
}

seedData();
