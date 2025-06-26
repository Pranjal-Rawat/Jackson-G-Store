// /app/api/reduce-stock/route.js  (POST)
import clientPromise from '@/lib/mongodb';
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

    const client   = await clientPromise;
    const db       = client.db('jackson-grocery-store');
    const products = db.collection('products');

    // ---------- build bulkWrite ops ----------
    const ops = cartItems.map((item) => {
      const qty = Math.max(+item.quantity || 0, 0);
      if (!qty) return null;

      // resolve the best identifier we have (_id, productId, id, slug)
      let filter = {};
      if (item._id && ObjectId.isValid(item._id))          filter._id = new ObjectId(item._id);
      else if (item.productId && ObjectId.isValid(item.productId)) filter._id = new ObjectId(item.productId);
      else if (item.id)   filter.id   = item.id;
      else if (item.slug) filter.slug = item.slug;

      return {
        updateOne: {
          filter : { ...filter, stock: { $gte: qty } },
          update : { $inc: { stock: -qty } },
        },
      };
    }).filter(Boolean); // drop nulls

    if (ops.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Empty cart' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ---------- helper: run bulkWrite inside a transaction if possible ----------
    const runWrite = async () => {
      const isReplicaSet = client.topology?.description?.type === 'ReplicaSetWithPrimary';
      if (!isReplicaSet) {
        // local/dev → single write without transaction
        return products.bulkWrite(ops, { ordered: false });
      }

      const session = client.startSession();
      return session.withTransaction(async () => {
        await products.bulkWrite(ops, { ordered: false, session });
      });
    };

    // ---------- execute (with up-to-3 retries on transient txn errors) ----------
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await runWrite();
        break;                                             // ✅ success, no retry needed
      } catch (err) {
        const transient = err?.errorLabels?.includes('TransientTransactionError');
        if (!transient || attempt === 2) throw err;        // give up after 3 tries
      }
    }

    // ---------- post-check: find any lines that still lack stock ----------
    const mismatch = [];
    for (const item of cartItems) {
      const filter = item.slug
        ? { slug: item.slug }
        : item.id
          ? { id: item.id }
          : { _id: new ObjectId(item._id || item.productId) };
      const doc = await products.findOne(filter, { projection: { stock: 1 } });
      if (doc && doc.stock < 0) mismatch.push({ ...item, available: doc.stock });
    }

    if (mismatch.length) {
      // (extremely rare) roll back: add quantities back
      await products.bulkWrite(
        cartItems.map((i) => {
          const qty = Math.max(+i.quantity || 0, 0);
          let filter = {};
          if (i._id && ObjectId.isValid(i._id))          filter._id = new ObjectId(i._id);
          else if (i.productId && ObjectId.isValid(i.productId)) filter._id = new ObjectId(i.productId);
          else if (i.id)   filter.id   = i.id;
          else if (i.slug) filter.slug = i.slug;
          return { updateOne: { filter, update: { $inc: { stock: +qty } } } };
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
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[POST /api/reduce-stock]', err);
    return new Response(
      JSON.stringify({ error: 'Stock update failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
