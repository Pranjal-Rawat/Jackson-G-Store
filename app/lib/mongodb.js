/* eslint-disable @typescript-eslint/no-var-requires */

// Route: Internal – MongoDB connection helper for serverless Next.js
// (SEO-neutral: Backend only, but crucial for performance and site reliability.)
// Ensures secure, persistent connection for API and SSR logic.

/*
  NOTES:
  - Never leak secrets (like MONGODB_URI) to the client.
  - Google rewards site health, reliability, and clean code.
  - For best SEO, ensure all API/SSR routes are fast and reliable.
*/
// /app/lib/mongodb.js
import { MongoClient } from 'mongodb';

// In dev mode, you can optionally load .env.local (not needed if already loaded by Next.js)
if (process.env.NODE_ENV !== 'production') {
  // Using dynamic import for dotenv in ESM
  const dotenv = await import('dotenv');
  dotenv.config({ path: '.env.local' });
}

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let clientPromise;
const globalForMongo = globalThis;

if (!globalForMongo._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  globalForMongo._mongoClientPromise = client.connect();
}
clientPromise = globalForMongo._mongoClientPromise;

export default clientPromise;
