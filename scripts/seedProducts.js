/**
 * patchBlanks.js – add any missing core fields, leave them blank
 * --------------------------------------------------------------
 *  $ node scripts/patchBlanks.js
 *
 *  • Fills only fields that are  ❌ missing OR null/undefined
 *  • Touch-nothing-else (keeps existing good values)
 *  • Runs in one bulkWrite batch → fast even for 6k docs
 */

import { MongoClient } from "mongodb";

// ── tweak here if you want random letters instead of "" ─────────
const PLACEHOLDER = () => "";                // ""     ← empty
// const PLACEHOLDER = () => String.fromCharCode(97 + Math.random() * 26 | 0); // "a"-"z"

// ── expected schema keys you care about ─────────────────────────
const FIELDS = [
  "title",
  "description",
  "price",
  "mrp",
  "stock",
  "category",
  "image",
];

// ── connect ─────────────────────────────────────────────────────
const uri    = process.env.MONGODB_URI;
const client = new MongoClient(uri);
await client.connect();
const db     = client.db("jackson-grocery-store");
const col    = db.collection("products");

console.log("🔗  Connected to", db.databaseName);

// ── build bulk ops (one updateMany per field) ───────────────────
const ops = FIELDS.map((field) => ({
  updateMany: {
    filter: {
      $or: [
        { [field]: { $exists: false } },   // field missing entirely
        { [field]: null },                 // field exists but is null
      ],
    },
    update: [
      {
        $set: {
          [field]: {
            $ifNull: [`$${field}`, PLACEHOLDER()],
          },
        },
      },
    ],
  },
}));

// ── execute ─────────────────────────────────────────────────────
const res = await col.bulkWrite(ops, { ordered: false });
console.log(
  `✅  Matched ${res.matchedCount}, modified ${res.modifiedCount} docs`,
);

await client.close();
console.log("🛑  Done.");
