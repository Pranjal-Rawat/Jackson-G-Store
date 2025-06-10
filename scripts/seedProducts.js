// scripts/seedProducts.js

import 'dotenv/config';
import clientPromise from '../app/lib/mongodb.js';
import products from '../data/products.js'; // updated: named export → default
import categories from '../data/categories.js'; // updated: CJS → ESM

async function seedData() {
  try {
    const client = await clientPromise;
    const db = client.db("jackson-grocery-store");

    const deleteProductsResult = await db.collection("products").deleteMany();
    console.log(`🗑️ Deleted ${deleteProductsResult.deletedCount} existing products.`);

    const deleteCategoriesResult = await db.collection("categories").deleteMany();
    console.log(`🗑️ Deleted ${deleteCategoriesResult.deletedCount} existing categories.`);

    const insertProductsResult = await db.collection("products").insertMany(products);
    console.log(`🌱 Seeded ${insertProductsResult.insertedCount} products.`);

    const insertCategoriesResult = await db.collection("categories").insertMany(categories);
    console.log(`🌱 Seeded ${insertCategoriesResult.insertedCount} categories.`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seedData();
