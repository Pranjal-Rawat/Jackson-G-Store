import BusinessInfo from "../../components/BusinessInfo";

export const metadata = {
  title: "About Us | Jackson Grocery Store | Grocery Store Dehradun",
  description:
    "Learn about Jackson Grocery Store, Dehradun's most trusted online grocery store. Fresh groceries, best prices, fast delivery, and quality service.",
  keywords:
    "About Jackson Grocery Store, Grocery Store Dehradun, About us, Online grocery, Fresh groceries Dehradun, Departmental store, World of groceries",
  alternates: {
    canonical: "https://jackson-grocery.com/about",
  },
  openGraph: {
    title: "About Jackson Grocery Store | Grocery Store Dehradun",
    description:
      "Get to know the team and story behind Jackson Grocery Store, Dehradun's trusted name for fresh groceries and quality service.",
    url: "https://jackson-grocery.com/about",
    siteName: "Jackson Grocery Store",
    images: [
      {
        url: "https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png",
        width: 1200,
        height: 630,
        alt: "Jackson Grocery Store",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Jackson Grocery Store",
    description:
      "Learn more about Jackson Grocery Store, Dehradun's favorite online grocery shopping experience.",
    images: [
      "https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png",
    ],
  },
  other: {
    'ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "GroceryStore",
      "@id": "https://jackson-grocery.com",
      name: "Jackson Grocery Store",
      url: "https://jackson-grocery.com/about",
      telephone: "+91 74172 29660",
      email: "omsairetail3@gmail.com",
      image: "https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1 Municipal Road, Dalanwala",
        addressLocality: "Dehradun",
        addressRegion: "Uttarakhand",
        postalCode: "248001",
        addressCountry: "IN",
      }
    }),
  },
};

export default function AboutPage() {
  return (
    <main className="pt-[5.5rem] min-h-screen bg-white">
      <section className="max-w-2xl mx-auto my-10 px-4 text-center text-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-[#ed3237]">
          About Jackson Grocery Store
        </h1>
        <p className="mb-4 text-lg">
          <b>Jackson Grocery Store</b> is Dehradun’s most trusted online grocery destination. Our mission is to bring fresh, high-quality groceries, fruits, vegetables, and daily essentials to your doorstep—quickly, safely, and at the best prices.
        </p>
        <p className="mb-4">
          With a wide range of products, easy online ordering, and reliable home delivery, we are committed to making your grocery shopping hassle-free and delightful. We believe in strict quality checks, transparent pricing, and a 100% satisfaction guarantee.
        </p>
        <p className="mb-6">
          Thank you for supporting a local Dehradun business. We look forward to serving you and your family!
        </p>
        <div className="text-sm text-gray-500">
          <b>Location:</b> 1 Municipal Road, Dalanwala, Dehradun, Uttarakhand, 248001<br />
          <b>Contact:</b> +91 74172 29660<br />
          <b>Email:</b> omsairetail3@gmail.com
        </div>
      </section>
      <BusinessInfo />
    </main>
  );
}
