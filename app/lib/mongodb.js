// app/lib/mongodb.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// ✅ Manually load .env.local when running scripts
dotenv.config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let client;
let clientPromise;

const globalForMongo = globalThis;

if (!globalForMongo._mongoClientPromise) {
  client = new MongoClient(uri, options);
  globalForMongo._mongoClientPromise = client.connect();
}

clientPromise = globalForMongo._mongoClientPromise;

export default clientPromise;
