// scripts/seedProducts.js

import 'dotenv/config'; // replaces require('dotenv').config()
import clientPromise from '../app/lib/mongodb.js'; // use .js extension for ESM
import { products } from '../data/products.js'; // use .js extension for ESM
import { categories } from '../data/categories.cjs'; // CJS file is fine

async function seedData() {
  try {
    const client = await clientPromise;
    const db = client.db("jackson-grocery-store");

    const deleteProductsResult = await db.collection("products").deleteMany();
    console.log(`Deleted ${deleteProductsResult.deletedCount} existing products.`);

    const deleteCategoriesResult = await db.collection("categories").deleteMany();
    console.log(`Deleted ${deleteCategoriesResult.deletedCount} existing categories.`);

    const insertProductsResult = await db.collection("products").insertMany(products);
    console.log(`🌱 Successfully seeded ${insertProductsResult.insertedCount} products!`);

    const insertCategoriesResult = await db.collection("categories").insertMany(categories);
    console.log(`🌱 Successfully seeded ${insertCategoriesResult.insertedCount} categories!`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed data:", err);
    process.exit(1);
  }
}

seedData();
