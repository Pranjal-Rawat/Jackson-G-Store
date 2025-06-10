import clientPromise from '../../lib/mongodb';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// Dynamic Metadata for SEO
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
          url: product.image || '/placeholder.png',
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

  // Fallbacks for legacy or Excel field names
  const title = product.title || product['Product Name'] || 'Product';
  const description = product.description || product.Description || '';
  const price = product.price || product.Price || 'N/A';
  const stock = product.stock ?? 'N/A';
  const category = product.category || 'General';

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-3xl mx-auto p-6 flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="flex-shrink-0 w-full md:w-1/2">
          <div className="relative w-full h-72 md:h-96 bg-white rounded-lg overflow-hidden shadow">
            <Image
              src={product.image || '/placeholder.png'}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 500px"
              priority
            />
          </div>
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-lg text-gray-700 mb-4">{description}</p>
            <div className="text-xl text-red-600 font-semibold mb-4">
              {typeof price === 'number' || !isNaN(Number(price)) ? <>₹{Number(price).toFixed(2)}</> : <>₹N/A</>}
            </div>
            <div className="text-gray-500 text-sm mb-2">Category: {category}</div>
            <div className="text-gray-500 text-sm mb-4">In Stock: {stock}</div>
          </div>
          {/* Add to Cart Button (optional: replace with actual cart logic) */}
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors mt-4"
            onClick={() => {
              alert('Add to Cart logic here');
            }}
            aria-label={`Add ${title} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
