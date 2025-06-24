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

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Global cache for development to prevent re-creating connections
let clientPromise;

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
