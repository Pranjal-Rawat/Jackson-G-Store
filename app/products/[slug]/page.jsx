import clientPromise from '../../lib/mongodb';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// SEO Metadata
export async function generateMetadata({ params }) {
  const { slug } = params;
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');
  const product = await db.collection('products').findOne({ slug });
  if (!product) return {};
  const title = `${product.title || product['Product Name'] || 'Product'} - Jackson Grocery`;
  const description =
    product.description ||
    product.Description ||
    'View product details on Jackson Grocery.';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.image || '/images/logo.svg',
          width: 800,
          height: 600,
          alt: product.title || product['Product Name'] || 'Product image',
        },
      ],
    },
  };
}



export default async function ProductPage({ params }) {
  const { slug } = params;
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');

  const product = await db.collection('products').findOne({ slug });
  if (!product) return notFound();

  const related = await db
    .collection('products')
    .find({ category: product.category, slug: { $ne: slug } })
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
  const stock = mainProduct.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const category = mainProduct.category || 'General';

  return (
    <main className="max-w-3xl mx-auto pt-28 pb-16 px-2 sm:px-4 bg-gray-50 min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-md flex flex-col md:flex-row gap-8 p-4 sm:p-8 relative">
        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <span className="absolute top-5 right-5 z-10 bg-red-600 text-white px-3 py-1 rounded-full font-bold text-xs shadow">
            Out of Stock
          </span>
        )}
        {/* Product Image */}
        <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center items-center">
          <div className="relative w-full h-56 sm:h-72 md:h-96 bg-white rounded-xl overflow-hidden shadow">
            <Image
              src={mainProduct.image || '/images/logo.svg'}
              alt={title}
              fill
              className="object-contain bg-white"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />
          </div>
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">{title}</h1>
            <p className="text-base sm:text-lg text-gray-700 mb-4">{description}</p>
            <div className="text-2xl text-red-600 font-extrabold mb-3">
              ₹{price.toFixed(2)}
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
          {/* AddToCartButton */}
          <div className="mt-4">
            <AddToCartButton product={mainProduct} disabled={isOutOfStock} className="w-full" />
          </div>
        </div>
      </div>

      {/* --- Related Products --- */}
      {relatedSafe.length > 0 && (
        <>
          <h2 className="font-semibold mb-4 mt-12 text-lg sm:text-xl text-gray-800">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedSafe.map((p) => {
              const relStock = p.stock ?? 0;
              const relIsOut = relStock <= 0;
              return (
                <div
                  key={p._id}
                  className="group bg-white border border-[#ffcc29]/20 rounded-2xl p-3 flex flex-col items-center shadow hover:shadow-lg transition relative"
                >
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
                        src={p.image || '/images/logo.svg'}
                        alt={p.title}
                        fill
                        className="object-contain rounded-xl bg-white"
                        sizes="96px"
                      />
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-center mb-1 truncate w-full">
                      {p.title}
                    </div>
                    <div className="text-red-600 font-bold text-sm mb-1">
                      ₹{typeof p.price === 'number' ? p.price.toFixed(2) : 'N/A'}
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
    </main>
  );
}

