// /app/category/page.jsx – SEO-optimized Category landing

// ---- SEO Metadata ----
export const metadata = {
  title: "Browse Grocery Categories | Jackson Grocery Store | Grocery Store Dehradun",
  description:
    "Shop by category and find the best deals on groceries, fruits, snacks, essentials, and more at Jackson Grocery Store in Dehradun. Fastest home delivery and top brands.",
  keywords:
    "Grocery categories, Buy groceries online Dehradun, Jackson Grocery Store, Best grocery store, Fruits, Snacks, Essentials, Dairy, Fast grocery delivery Dehradun, Shop by category",
  alternates: {
    canonical: "https://jackson-grocery.com/category",
  },
  openGraph: {
    title: "Browse Grocery Categories | Jackson Grocery Store",
    description:
      "Browse all categories and shop the best groceries, snacks, fruits, and essentials in Dehradun with Jackson Grocery Store.",
    url: "https://jackson-grocery.com/category",
    siteName: "Jackson Grocery Store",
    images: [
      {
        url: "https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png",
        width: 1200,
        height: 630,
        alt: "Jackson Grocery Store Categories",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Grocery Categories | Jackson Grocery Store",
    description:
      "Shop by category for groceries, fruits, and daily essentials with Jackson Grocery Store, Dehradun.",
    images: [
      "https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png",
    ],
  },
  other: {
    'ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://jackson-grocery.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "All Categories",
          item: "https://jackson-grocery.com/category",
        },
      ],
    }),
  },
};

import BusinessInfo from '../../components/BusinessInfo';
import CategoryCarousel from '../../components/CategoryCarousel';

export default function CategoryHomePage() {
  return (
    <main className="pt-[5.5rem] min-h-screen bg-white">
      {/* Category Grid or Carousel */}
      <CategoryCarousel />

      {/* SEO Text Block */}
      <section className="max-w-2xl mx-auto my-10 px-4 text-center text-gray-700">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
          Shop by Category – Groceries Delivered Fresh
        </h1>
        <p className="leading-relaxed">
          Discover our wide range of categories including fresh fruits, dairy, snacks,
          household essentials, and more. Enjoy fast home delivery and top brands with
          Jackson Grocery Store in Dehradun.
        </p>
      </section>

      {/* Local business info at the end */}
      <BusinessInfo />
    </main>
  );
}
