// File: app/api/admin/products/route.js
import { NextResponse }     from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ObjectId }         from 'mongodb';
import clientPromise        from '@/app/lib/mongodb';
import { authOptions }      from '@/app/api/auth/[...nextauth]/route';

/* ─── helpers ─────────────────────────────────────────── */
const toBool = v => (v === true || String(v).toLowerCase() === 'true');
const toNum  = v => (v === '' || v === undefined ? 0 : Number(v) || 0);
const toStr  = v => (v === undefined ? '' : String(v).trim());
const toTags = v =>
  Array.isArray(v) ? v : String(v || '').split(',').map(t => t.trim()).filter(Boolean);
const toArrStr = v =>
  (Array.isArray(v) ? v : []).map(toStr).filter(Boolean);

const catch500 = (err, tag) => {
  console.error(`[products] ${tag}:`, err);
  return NextResponse.json({ error: 'Internal error' }, { status: 500 });
};

const validateMinimal = p =>
  !p.title && !p.slug ? ['At least title or slug is required'] : [];

/* ─── GET (list or single) ───────────────────────────── */
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const url  = new URL(req.url);
    const id   = url.searchParams.get('id');
    const db   = (await clientPromise).db('jackson-grocery-store');
    const col  = db.collection('products');

    /* single product */
    if (id) {
      const prod = await col.findOne({ _id: new ObjectId(id) });
      if (!prod) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(prod);
    }

    /* list / table */
    const skip  = Math.max(0, parseInt(url.searchParams.get('skip')  ?? '0', 10) || 0);
    const limit = Math.min(50, Math.max(1,
                  parseInt(url.searchParams.get('limit') ?? '10', 10) || 10));
    const q     = url.searchParams.get('q')?.trim() || '';

    const filter = q
      ? { $or: [
          { title: { $regex: q, $options: 'i' } },
          { slug:  { $regex: q, $options: 'i' } },
          { brand: { $regex: q, $options: 'i' } },
        ] }
      : {};

    const table = url.searchParams.get('table') === '1';
    const proj  = table
      ? { image: 1, images: 1, title: 1, price: 1, stock: 1 } // cover + array
      : { title: 1, slug: 1 };

    const products = await col
      .find(filter)
      .project(proj)
      .sort({ createdAt: -1, _id: 1 })   // stable secondary key
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(products);
  } catch (err) {
    return catch500(err, 'GET');
  }
}

/* ─── POST (create) ─────────────────────────────────── */
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });

    const errs = validateMinimal(body);
    if (errs.length) {
      return NextResponse.json({ error: 'Validation failed', details: errs }, { status: 422 });
    }

    const db  = (await clientPromise).db('jackson-grocery-store');
    const col = db.collection('products');

    /* unique slug safeguard */
    const slug = toStr(body.slug || body.title);
    if (await col.findOne({ slug })) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const imgArr = toArrStr(body.images);
    const cover  = toStr(body.imageUrl || imgArr[0] || '');

    const doc = {
      title:         toStr(body.title),
      slug,
      category:      toStr(body.category),
      brand:         toStr(body.brand),
      unit:          toStr(body.unit),
      packSize:      toStr(body.packSize),
      quantity:      toNum(body.quantity),
      price:         toNum(body.price),
      originalPrice: toNum(body.originalPrice),
      stock:         toNum(body.stock),
      rank:          toNum(body.rank),
      description:   toStr(body.description),
      image:         cover,           // legacy cover
      images:        imgArr,          // new array field
      featured:      toBool(body.featured),
      popular:       toBool(body.popular),
      tags:          toTags(body.tags),
      options:       body.options ?? [],
      createdAt:     new Date(),
    };

    const { insertedId } = await col.insertOne(doc);
    return NextResponse.json({ success: true, id: insertedId }, { status: 201 });
  } catch (err) {
    return catch500(err, 'POST');
  }
}

/* ─── PUT (patch update) ────────────────────────────── */
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, ...patch } = await req.json().catch(() => ({}));
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const $set = {};
    if (patch.title        !== undefined) $set.title         = toStr(patch.title);
    if (patch.slug         !== undefined) $set.slug          = toStr(patch.slug || patch.title);
    if (patch.category     !== undefined) $set.category      = toStr(patch.category);
    if (patch.brand        !== undefined) $set.brand         = toStr(patch.brand);
    if (patch.unit         !== undefined) $set.unit          = toStr(patch.unit);
    if (patch.packSize     !== undefined) $set.packSize      = toStr(patch.packSize);
    if (patch.quantity     !== undefined) $set.quantity      = toNum(patch.quantity);
    if (patch.price        !== undefined) $set.price         = toNum(patch.price);
    if (patch.originalPrice!== undefined) $set.originalPrice = toNum(patch.originalPrice);
    if (patch.stock        !== undefined) $set.stock         = toNum(patch.stock);
    if (patch.rank         !== undefined) $set.rank          = toNum(patch.rank);
    if (patch.description  !== undefined) $set.description   = toStr(patch.description);
    if (patch.imageUrl     !== undefined) $set.image         = toStr(patch.imageUrl);
    if (patch.images       !== undefined) $set.images        = toArrStr(patch.images);
    if (patch.featured     !== undefined) $set.featured      = toBool(patch.featured);
    if (patch.popular      !== undefined) $set.popular       = toBool(patch.popular);
    if (patch.tags         !== undefined) $set.tags          = toTags(patch.tags);
    if (patch.options      !== undefined) $set.options       = patch.options;
    if (Object.keys($set).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }
    $set.updatedAt = new Date();

    const db  = (await clientPromise).db('jackson-grocery-store');
    const col = db.collection('products');
    await col.updateOne({ _id: new ObjectId(id) }, { $set });

    return NextResponse.json({ success: true });
  } catch (err) {
    return catch500(err, 'PUT');
  }
}

/* ─── DELETE (hard delete) ──────────────────────────── */
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const db  = (await clientPromise).db('jackson-grocery-store');
    const col = db.collection('products');
    await col.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (err) {
    return catch500(err, 'DELETE');
  }
}
