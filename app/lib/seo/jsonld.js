// // app/category/[slug]/page.jsx
// import { getCategoryJsonLd } from '@/lib/seo/jsonld';

// export default async function CategoryPage({ params }) {
//   const { slug } = params;
//   const categoryName = ... // generate from slug
//   const url = `https://yourdomain.com/category/${slug}`;
//   const jsonLd = getCategoryJsonLd({ name: categoryName, url });

//   return (
//     <main>
//       {/* ... */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />
//       {/* ... */}
//     </main>
//   );
// }
