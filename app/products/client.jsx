import clientPromise from '../../lib/mongodb';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '../../components/AddToCartButton';
import Link from 'next/link';
import { getProductJsonLD } from '../../lib/seo/jsonld';
import BusinessInfo from '../../../components/BusinessInfo';
import { getOptimizedCloudinaryUrl } from '../../lib/getOptimizedCloudinaryUrl';

export const dynamic = 'force-dynamic'; // Always SSR, latest data

export async function generateMetadata({ params }) {
  const { slug } = params;
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');
  const product = await db
    .collection('products')
    .findOne({ slug }, { projection: { description: 1, title: 1, image: 1, price: 1, stock: 1, category: 1, mrp: 1 } });
  if (!product) return {};

  const title = `${product.title || product['Product Name'] || 'Product'} - Jackson Grocery Store | Grocery Store Dehradun`;
  const description =
    product.description ||
    product.Description ||
    'View product details on Jackson Grocery Store. Buy fresh groceries online in Dehradun.';
  const image = getOptimizedCloudinaryUrl(product.image || '/images/logo.svg');
  const price = Number(product.price || product.Price || 0);
  const stock = product.stock ?? 0;

  return {
    title,
    description,
    keywords:
      'Jackson Grocery Store, Grocery Store Dehradun, Best Grocery Store, Fresh groceries Dehradun, Buy groceries online Dehradun, Jackson groceries, ' +
      (product.title || product['Product Name'] || '') +
      ', ' +
      (product.category || ''),
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
          alt: product.title || product['Product Name'] || 'Product image',
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
          title: product.title || product['Product Name'] || 'Product',
        })
      ),
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = params;
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');

  const product = await db
    .collection('products')
    .findOne({ slug }, { projection: { description: 1, title: 1, image: 1, price: 1, mrp: 1, stock: 1, category: 1, unit: 1, pcs: 1, rank: 1, popular: 1, _id: 1 } });
  if (!product) return notFound();

  const related = await db
    .collection('products')
    .find({ category: product.category, slug: { $ne: slug } }, { projection: { title: 1, image: 1, price: 1, mrp: 1, stock: 1, category: 1, unit: 1, pcs: 1, rank: 1, popular: 1, slug: 1, _id: 1 } })
    .limit(8)
    .toArray();

  const mainProduct = {
    ...product,
    _id: product._id?.toString?.() || product._id || '',
  };
  const relatedSafe = related.map((p) => ({
    ...p,
    _id: p._id?.toString?.() || p._id || '',
  }));

  const title = mainProduct.title || mainProduct['Product Name'] || 'Product';
  const description = mainProduct.description || mainProduct.Description || '';
  const price = Number(mainProduct.price || mainProduct.Price || 0);
  const mrp = mainProduct.mrp || '';
  const stock = mainProduct.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const category = mainProduct.category || 'General';
  const image = getOptimizedCloudinaryUrl(mainProduct.image || '/images/logo.svg');
  const unit = mainProduct.unit || mainProduct.quantity || '';
  const pcs = mainProduct.pcs || '';
  const rank = mainProduct.rank;
  const isPopular = mainProduct.popular === true || mainProduct.popular === 'true';

  return (
    <main className="max-w-3xl mx-auto pt-28 pb-16 px-2 sm:px-4 bg-gray-50 min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-md flex flex-col md:flex-row gap-8 p-4 sm:p-8 relative">
        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
          {typeof rank === "number" && (
            <span className="bg-[#ffcc29] text-[#ed3237] px-2 py-1 rounded-full text-xs font-bold shadow-sm border border-[#ffe58a]">
              Rank #{rank}
            </span>
          )}
          {isPopular && (
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm border border-red-300">
              ★ Popular
            </span>
          )}
        </div>
        {isOutOfStock && (
          <span className="absolute top-5 right-5 z-10 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-xs shadow">
            Out of Stock
          </span>
        )}
        <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center items-center">
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
              <span className="text-2xl text-red-600 font-extrabold">
                ₹{price.toFixed(2)}
              </span>
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
            <AddToCartButton product={mainProduct} disabled={isOutOfStock} className="w-full" />
          </div>
        </div>
      </div>

      {relatedSafe.length > 0 && (
        <>
          <h2 className="font-semibold mb-4 mt-12 text-lg sm:text-xl text-gray-800">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedSafe.map((p) => {
              const relImage = getOptimizedCloudinaryUrl(p.image || '/images/logo.svg');
              const relStock = p.stock ?? 0;
              const relIsOut = relStock <= 0;
              const relUnit = p.unit || p.quantity || '';
              const relPcs = p.pcs || '';
              const relRank = p.rank;
              const relPopular = p.popular === true || p.popular === 'true';
              const relMrp = p.mrp || '';
              return (
                <div
                  key={p._id}
                  className="group bg-white border border-[#ffcc29]/20 rounded-2xl p-3 flex flex-col items-center shadow hover:shadow-lg transition relative"
                >
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {typeof relRank === "number" && (
                      <span className="bg-[#ffcc29] text-[#ed3237] px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm border border-[#ffe58a]">
                        Rank #{relRank}
                      </span>
                    )}
                    {relPopular && (
                      <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm border border-red-300">
                        ★ Popular
                      </span>
                    )}
                  </div>
                  {relIsOut && (
                    <span className="absolute top-3 right-3 z-10 bg-red-600 text-white px-2 py-0.5 rounded-full font-bold text-xs shadow">
                      Out of Stock
                    </span>
                  )}
                  <Link
                    href={`/products/${p.slug}`}
                    className="w-full flex flex-col items-center"
                    tabIndex={-1}
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 flex items-center justify-center">
                      <Image
                        src={relImage}
                        alt={p.title || 'Related product'}
                        fill
                        className="object-contain rounded-xl bg-white"
                        sizes="96px"
                        placeholder="blur"
                        blurDataURL="/images/logo.svg"
                      />
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-center mb-1 truncate w-full">
                      {p.title}
                    </div>
                    {(relUnit || relPcs) && (
                      <div className="text-[11px] text-gray-500 font-medium mb-1 flex gap-1">
                        {relUnit && <span>{relUnit}</span>}
                        {relPcs && <span className="text-gray-400">| {relPcs} PCS</span>}
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
                  <div className="mt-2 w-full flex justify-center">
                    <AddToCartButton product={p} className="w-full py-1 text-xs" disabled={relIsOut} />
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
