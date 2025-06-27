/* eslint-disable @typescript-eslint/no-var-requires */
// /app/lib/mongodb.js
// MongoDB connection helper for serverless Next.js (never client!)
// Fast DB = fast API = better SEO/Core Web Vitals

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {}; // (add Mongo options here if needed)

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Use global cache to avoid re-creating clients during hot reloads in dev
let clientPromise;
/**
 * @type {Promise<MongoClient>}
 * Only use on the server (API/SSR/components), never in client bundle.
 */
if (!globalThis._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  globalThis._mongoClientPromise = client.connect();
}
clientPromise = globalThis._mongoClientPromise;

export default clientPromise;

/*
  SEO NOTE:
  - Fast, reliable API/database connections improve SEO via better Core Web Vitals.
  - Never import/export this file in client-side code.
  - Never leak secrets.
*/
