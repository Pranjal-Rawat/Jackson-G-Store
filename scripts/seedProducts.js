const clientPromise = require("../app/lib/mongodb");
const { products } = require("../data/products"); // Ensure products are imported correctly
const { categories } = require("../data/categories"); // Import categories

async function seedData() {
  try {
    // Establish connection to the database
    const client = await clientPromise;
    const db = client.db("grocery-store");

    // Optional: Clear existing data before seeding new data
    const deleteProductsResult = await db.collection("products").deleteMany();
    console.log(`Deleted ${deleteProductsResult.deletedCount} existing products.`);

    const deleteCategoriesResult = await db.collection("categories").deleteMany();
    console.log(`Deleted ${deleteCategoriesResult.deletedCount} existing categories.`);

    // Insert new products
    const insertProductsResult = await db.collection("products").insertMany(products);
    console.log(`🌱 Successfully seeded ${insertProductsResult.insertedCount} products!`);

    // Insert new categories
    const insertCategoriesResult = await db.collection("categories").insertMany(categories);
    console.log(`🌱 Successfully seeded ${insertCategoriesResult.insertedCount} categories!`);

    process.exit(0); // Exit with success code
  } catch (err) {
    console.error("❌ Failed to seed data:", err);
    process.exit(1); // Exit with error code
  }
}

seedData();