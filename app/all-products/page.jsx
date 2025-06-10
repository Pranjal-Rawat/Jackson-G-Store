import clientPromise from '../lib/mongodb';

export default async function AllProductsPage() {
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');
  const products = await db.collection('products').find().toArray();

  const safeProducts = products.map(p => ({
    ...p,
    _id: p._id?.toString(),
  }));

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">All Products (Debug Page)</h1>
        <div>Fetched: {safeProducts.length} products</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {safeProducts.map(product => (
            <div
              key={product._id || product.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-44 w-full bg-gray-100 rounded-t-xl overflow-hidden flex items-center justify-center">
                <img
                  src={product.image || '/placeholder.png'}
                  alt={product.title || product['Product Name'] || 'Product'}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h2 className="font-semibold text-base mb-1 truncate">
                  {product.title || product['Product Name'] || '[NO TITLE]'}
                </h2>
                <div className="text-red-600 font-bold text-lg mb-2">
                  ₹{product.price ?? product.Price ?? 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
