// app/page.jsx
import PerformanceCarousel from '../components/Carousel';
import CategoryCarousel from '../components/CategoryCarousel';
import PopularProducts from '../components/PopularProducts';
import clientPromise from './lib/mongodb';

// ---- SEO Constants ----
const siteUrl = 'https://jackson-grocery.com';
const siteName = 'Jackson Grocery Store';
const description =
  'Buy fresh groceries online in Dehradun from Jackson Grocery Store. Best quality fruits, vegetables, daily essentials, and more. Fast home delivery. Grocery Store Dehradun. Best grocery shop near you.';
const keywords =
  'Jackson Grocery Store, Grocery Store Dehradun, Best Grocery Store Dehradun, World of Groceries, Departmental Store Dehradun, Fresh groceries Dehradun, Grocery home delivery Dehradun, Buy groceries online Dehradun, Jackson groceries';
const logo =
  'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png';
const phone = '+91-7417229660';
const address = {
  street: '1 Municipal Road, Dalanwala',
  city: 'Dehradun',
  state: 'Uttarakhand',
  postalCode: '248001',
  country: 'IN',
};

export const metadata = {
  title: 'Jackson Grocery Store | Grocery Store Dehradun | Fresh Groceries Online',
  description,
  keywords,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Jackson Grocery Store | Grocery Store Dehradun',
    description,
    url: siteUrl,
    siteName,
    images: [
      {
        url: logo,
        width: 1200,
        height: 630,
        alt: 'Jackson Grocery Store',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@jackson_grocery',
    title: 'Jackson Grocery Store | Grocery Store Dehradun',
    description,
    images: [logo],
  },
  other: {
    'ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'GroceryStore',
      name: siteName,
      image: logo,
      url: siteUrl,
      telephone: phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: address.street,
        addressLocality: address.city,
        addressRegion: address.state,
        postalCode: address.postalCode,
        addressCountry: address.country,
      },
      sameAs: [
        siteUrl,
        // Add Instagram, Facebook etc. if available
      ],
    }),
  },
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  const client = await clientPromise;
  const db = client.db('jackson-grocery-store');
  const products = await db.collection('products').find().toArray();
  const safeProducts = products.map((p) => ({
    ...p,
    _id: p._id?.toString(),
  }));

  const features = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
      title: 'Fast Delivery',
      desc: 'Get your order delivered within 24 hours',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      title: 'Quality Checked',
      desc: 'Every item goes through strict quality checks',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      ),
      title: 'Easy Returns',
      desc: '100% satisfaction guarantee or money back',
    },
  ];

  return (
    <>
      <PerformanceCarousel />
      <CategoryCarousel />

      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Fresh Groceries Delivered Daily
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Get farm-fresh fruits, vegetables, and daily essentials at your doorstep.
          </p>
        </div>
      </section>

      {/* Popular Products */}
      <section>
        <div className="max-w-7xl mx-auto px-4">
          <PopularProducts products={safeProducts} />
        </div>
      </section>

      {/* Quality Promise */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Quality Promise</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 hover:shadow-md transition-shadow rounded-lg"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white mx-auto mb-4">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
