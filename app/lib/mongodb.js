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

import { MongoClient } from 'mongodb';

// Load .env.local ONLY if not on Vercel (prevents double-loading or security risk)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' });
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

/*
  SEO NOTE:
  - Fast, reliable API/database connections improve SEO via better Core Web Vitals.
  - This file should never import/export anything frontend or leak env vars to the client bundle.
*/
