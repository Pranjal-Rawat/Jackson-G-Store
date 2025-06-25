import clientPromise from '../../lib/mongodb';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '../../../components/AddToCartButton';
import Link from 'next/link';
import { getProductJsonLD } from '../../lib/seo/jsonld';
import BusinessInfo from '../../../components/BusinessInfo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');
  const product = await db
    .collection('products')
    .findOne(
      { slug },
      { projection: { title: 1, description: 1, image: 1, price: 1, stock: 1, category: 1, mrp: 1 } }
    );
  if (!product) return {};

  const title = `${product.title || 'Product'} - Jackson Grocery Store | Grocery Store Dehradun`;
  const description =
    product.description ||
    'View product details on Jackson Grocery Store. Buy fresh groceries online in Dehradun.';
  const image = product.image || '/images/logo.svg';
  const price = Number(product.price || 0);
  const stock = product.stock ?? 0;

  return {
    title,
    description,
    keywords: `Jackson Grocery Store, Grocery Store Dehradun, Best Grocery Store, Buy groceries online Dehradun, ${product.title}, ${product.category}`,
    alternates: {
      canonical: `https://jackson-grocery.com/products/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://jackson-grocery.com/products/${slug}`,
      type: 'website',
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: product.title || 'Product Image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'ld+json': JSON.stringify(
        getProductJsonLD({
          ...product,
          slug,
          price,
          stock,
          image,
          description,
          title: product.title,
        })
      ),
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');

  const product = await db.collection('products').findOne(
    { slug },
    {
      projection: {
        title: 1,
        description: 1,
        image: 1,
        price: 1,
        mrp: 1,
        stock: 1,
        category: 1,
        unit: 1,
        pcs: 1,
        rank: 1,
        popular: 1,
        _id: 1,
      },
    }
  );

  if (!product) return notFound();

  const related = await db
    .collection('products')
    .find({ category: product.category, slug: { $ne: slug } })
    .project({
      title: 1,
      image: 1,
      price: 1,
      mrp: 1,
      stock: 1,
      category: 1,
      unit: 1,
      pcs: 1,
      rank: 1,
      popular: 1,
      slug: 1,
      _id: 1,
    })
    .limit(8)
    .toArray();

  const main = {
    ...product,
    _id: product._id?.toString() || '',
  };

  const relatedSafe = related.map((p) => ({
    ...p,
    _id: p._id?.toString() || '',
  }));

  const {
    title,
    description,
    price,
    mrp,
    stock,
    category,
    image,
    unit,
    pcs,
    rank,
    popular,
  } = {
    title: main.title,
    description: main.description || '',
    price: Number(main.price || 0),
    mrp: main.mrp,
    stock: main.stock ?? 0,
    category: main.category || 'General',
    image: main.image || '/images/logo.svg',
    unit: main.unit || '',
    pcs: main.pcs || '',
    rank: main.rank,
    popular: main.popular === true || main.popular === 'true',
  };

  const isOutOfStock = stock <= 0;

  return (
    <main className="max-w-3xl mx-auto pt-28 pb-16 px-2 sm:px-4 bg-gray-50 min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-md flex flex-col md:flex-row gap-8 p-4 sm:p-8 relative">
        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
          {typeof rank === 'number' && (
            <span className="bg-[#ffcc29] text-[#ed3237] px-2 py-1 rounded-full text-xs font-bold border border-[#ffe58a] shadow-sm">
              Rank #{rank}
            </span>
          )}
          {popular && (
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold border border-red-300 shadow-sm">
              ★ Popular
            </span>
          )}
        </div>
        {isOutOfStock && (
          <span className="absolute top-5 right-5 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
            Out of Stock
          </span>
        )}

        {/* Product Image */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="relative w-full h-56 sm:h-72 md:h-96 bg-white rounded-xl overflow-hidden shadow">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain bg-white"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
              placeholder="blur"
              blurDataURL="/images/logo.svg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">{title}</h1>
            {(unit || pcs) && (
              <div className="flex gap-2 text-sm text-gray-500 font-medium mb-2">
                {unit && <span>{unit}</span>}
                {pcs && <span className="text-gray-400">| {pcs} PCS</span>}
              </div>
            )}
            <p className="text-base sm:text-lg text-gray-700 mb-4">{description}</p>
            <div className="flex items-center gap-2 mb-3">
              {mrp && (
                <span className="text-sm text-gray-400 line-through">
                  MRP ₹{typeof mrp === 'number' ? mrp.toFixed(2) : mrp}
                </span>
              )}
              <span className="text-2xl text-red-600 font-extrabold">₹{price.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-500 mb-1">Category: {category}</div>
            <div className="text-sm text-gray-500 mb-3">
              {isOutOfStock ? (
                <span className="font-bold text-red-600">Out of Stock</span>
              ) : (
                <>In Stock: {stock}</>
              )}
            </div>
          </div>
          <div className="mt-4">
            <AddToCartButton product={main} disabled={isOutOfStock} className="w-full" />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedSafe.length > 0 && (
        <>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 mt-12 text-gray-800">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedSafe.map((p) => {
              const isOut = (p.stock ?? 0) <= 0;
              const relMrp = p.mrp;
              return (
                <div
                  key={p._id}
                  className="group bg-white border border-[#ffcc29]/20 rounded-2xl p-3 flex flex-col items-center shadow hover:shadow-lg transition relative"
                >
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {typeof p.rank === 'number' && (
                      <span className="bg-[#ffcc29] text-[#ed3237] px-2 py-0.5 rounded-full text-[10px] font-bold border border-[#ffe58a] shadow-sm">
                        Rank #{p.rank}
                      </span>
                    )}
                    {p.popular && (
                      <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold border border-red-300 shadow-sm">
                        ★ Popular
                      </span>
                    )}
                  </div>
                  {isOut && (
                    <span className="absolute top-3 right-3 z-10 bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow">
                      Out of Stock
                    </span>
                  )}
                  <Link href={`/products/${p.slug}`} className="w-full flex flex-col items-center">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2">
                      <Image
                        src={p.image || '/images/logo.svg'}
                        alt={p.title || 'Related product'}
                        fill
                        className="object-contain bg-white rounded-xl"
                        sizes="96px"
                        placeholder="blur"
                        blurDataURL="/images/logo.svg"
                      />
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-center mb-1 truncate w-full">
                      {p.title}
                    </div>
                    {(p.unit || p.pcs) && (
                      <div className="text-[11px] text-gray-500 font-medium mb-1 flex gap-1">
                        {p.unit && <span>{p.unit}</span>}
                        {p.pcs && <span className="text-gray-400">| {p.pcs} PCS</span>}
                      </div>
                    )}
                    <div className="flex items-center gap-1 mb-1">
                      {relMrp && (
                        <span className="text-[11px] text-gray-400 line-through">
                          ₹{typeof relMrp === 'number' ? relMrp.toFixed(2) : relMrp}
                        </span>
                      )}
                      <span className="text-red-600 font-bold text-sm">
                        ₹{typeof p.price === 'number' ? p.price.toFixed(2) : 'N/A'}
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500">{p.category}</div>
                  </Link>
                  <div className="mt-2 w-full">
                    <AddToCartButton product={p} className="w-full py-1 text-xs" disabled={isOut} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <BusinessInfo />
    </main>
  );
}
