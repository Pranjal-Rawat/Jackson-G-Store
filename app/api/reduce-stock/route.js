// /app/api/reduce-stock/route.js  (POST)
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const { cartItems } = await req.json();
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid cart items' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');
    const products = db.collection('products');

    // ---- Build bulkWrite ops ----
    const ops = cartItems.map((item) => {
      const qty = Math.max(Number(item.quantity) || 0, 0);
      if (!qty) return null;

      let filter = {};
      if (item._id && ObjectId.isValid(item._id)) filter._id = new ObjectId(item._id);
      else if (item.productId && ObjectId.isValid(item.productId)) filter._id = new ObjectId(item.productId);
      else if (item.id) filter.id = item.id;
      else if (item.slug) filter.slug = item.slug;

      return {
        updateOne: {
          filter: { ...filter, stock: { $gte: qty } },
          update: { $inc: { stock: -qty } },
        },
      };
    }).filter(Boolean);

    if (ops.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Empty cart' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ---- Helper: Run bulkWrite inside a transaction if possible ----
    const runWrite = async () => {
      const isReplicaSet = client.topology?.description?.type === 'ReplicaSetWithPrimary';
      if (!isReplicaSet) {
        // Local/dev: Single write without transaction
        return products.bulkWrite(ops, { ordered: false });
      }
      const session = client.startSession();
      try {
        return await session.withTransaction(async () => {
          await products.bulkWrite(ops, { ordered: false, session });
        });
      } finally {
        await session.endSession();
      }
    };

    // ---- Execute (up to 3 retries on transient errors) ----
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await runWrite();
        break;
      } catch (err) {
        const transient = err?.errorLabels?.includes('TransientTransactionError');
        if (!transient || attempt === 2) throw err;
      }
    }

    // ---- Post-check: Find any items now understocked (should be never) ----
    const mismatch = [];
    for (const item of cartItems) {
      let filter = {};
      if (item._id && ObjectId.isValid(item._id)) filter._id = new ObjectId(item._id);
      else if (item.productId && ObjectId.isValid(item.productId)) filter._id = new ObjectId(item.productId);
      else if (item.id) filter.id = item.id;
      else if (item.slug) filter.slug = item.slug;
      const doc = await products.findOne(filter, { projection: { stock: 1 } });
      if (doc && doc.stock < 0) mismatch.push({ ...item, available: doc.stock });
    }

    if (mismatch.length) {
      // (Extremely rare) Roll back: add quantities back
      await products.bulkWrite(
        cartItems.map((i) => {
          const qty = Math.max(Number(i.quantity) || 0, 0);
          let filter = {};
          if (i._id && ObjectId.isValid(i._id)) filter._id = new ObjectId(i._id);
          else if (i.productId && ObjectId.isValid(i.productId)) filter._id = new ObjectId(i.productId);
          else if (i.id) filter.id = i.id;
          else if (i.slug) filter.slug = i.slug;
          return { updateOne: { filter, update: { $inc: { stock: qty } } } };
        }),
        { ordered: false }
      );
      return new Response(
        JSON.stringify({ ok: false, understocked: mismatch }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store', // Always write operation!
      },
    });
  } catch (err) {
    console.error('[POST /api/reduce-stock]', err);
    return new Response(
      JSON.stringify({ error: 'Stock update failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
