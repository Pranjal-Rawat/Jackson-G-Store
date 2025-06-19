// Route: Internal – MongoDB connection helper for serverless Next.js

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load .env.local manually (useful for scripts, non-Vercel env)
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const options = {};

// Fail fast if no URI found
if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

// Use global scope to persist client across hot reloads in dev
let clientPromise;
const globalForMongo = globalThis;

if (!globalForMongo._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  globalForMongo._mongoClientPromise = client.connect();
}
clientPromise = globalForMongo._mongoClientPromise;

// Export a promise for use in API routes
export default clientPromise;
