// components/PopularProducts.jsx
'use client';

import { useCartStore } from '@/stores/cartStore';
import Image from 'next/image';
import { products } from '@/data/products';

export default function PopularProducts() {
  const addToCart = useCartStore((state) => state.addItem);

  // Filter popular products, sort by rank (lowest rank first), then take top 10
  const popularProducts = products
    .filter((product) => product.popular)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 10);

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Our Popular Products</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover rounded-t-lg"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={product.id <= 4} // Optimize early items for LCP
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-medium mb-1">{product.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-red-600 font-semibold">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{product.unit}</p>
                
                <button
                  onClick={() =>
                    addToCart({
                      ...product,
                      quantity: 1,
                      price: product.price,
                    })
                  }
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
                  aria-label={`Add ${product.title} to cart`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



// // components/PopularProducts.js
// 'use client';

// import { useCartStore } from '../components/stores/cartStore';
// import Image from 'next/image';

// const products = [
//   {
//     id: 1,
//     name: 'Cauliflower',
//     price: 3.00,
//     originalPrice: 4.00,
//     image: '/products/cauliflower.jpg',
//     unit: '1 pc'
//   },
//   {
//     id: 2,
//     name: 'Fresh Orange',
//     price: 5.00,
//     image: '/products/orange.jpg',
//     unit: '6 pcs'
//   },
//   {
//     id: 3,
//     name: 'Cilantro',
//     price: 0.98,
//     image: '/products/cilantro.jpg',
//     unit: '2 pcs'
//   },
//   {
//     id: 4,
//     name: 'Orange Carrot',
//     price: 4.99,
//     originalPrice: 5.99,
//     image: '/products/carrot.jpg',
//     unit: '1 kg'
//   }
// ];

// export default function PopularProducts() {
//   const addToCart = useCartStore(state => state.addItem);

//   return (
//     <section className="px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-2xl font-bold mb-8">Our Popular Products</h2>
        
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {products.map((product) => (
//             <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
//               <div className="relative h-48 w-full">
//                 <Image
//                   src={product.image}
//                   alt={product.name}
//                   fill
//                   className="object-cover rounded-t-lg"
//                   sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
//                   priority={product.id <= 4} // LCP optimization
//                 />
//               </div>
              
//               <div className="p-4">
//                 <h3 className="font-medium mb-1">{product.name}</h3>
//                 <div className="flex items-center gap-2 mb-2">
//                   {product.originalPrice && (
//                     <span className="text-sm text-gray-500 line-through">
//                       ${product.originalPrice.toFixed(2)}
//                     </span>
//                   )}
//                   <span className="text-primary-600 font-semibold">
//                     ${product.price.toFixed(2)}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-500 mb-3">{product.unit}</p>
                
//                 <button
//                   onClick={() => addToCart({ 
//                     ...product,
//                     quantity: 1,
//                     price: product.price
//                   })}
//                   className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors"
//                   aria-label={`Add ${product.name} to cart`}
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }