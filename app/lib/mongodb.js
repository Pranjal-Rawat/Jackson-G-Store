// app/lib/mongodb.js
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/grocery-store";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let clientPromise;

if (!clientPromise) {
  clientPromise = client.connect();
}

module.exports = clientPromise;