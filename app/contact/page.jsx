// /app/contact/page.jsx

export const metadata = {
  title: "Contact Us | Jackson Grocery Store | Grocery Store Dehradun",
  description:
    "Contact Jackson Grocery Store in Dehradun for orders, queries, or feedback. Fast response and quality customer service.",
  keywords:
    "Contact Jackson Grocery Store, Grocery Store Dehradun contact, Online grocery, Customer support, Departmental store Dehradun, World of groceries",
  alternates: {
    canonical: "https://jackson-grocery.com/contact",
  },
  openGraph: {
    title: "Contact Jackson Grocery Store | Grocery Store Dehradun",
    description:
      "Get in touch with Jackson Grocery Store, Dehradun's trusted name for fresh groceries and quality service.",
    url: "https://jackson-grocery.com/contact",
    siteName: "Jackson Grocery Store",
    images: [
      {
        url: "https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png",
        width: 1200,
        height: 630,
        alt: "Jackson Grocery Store Contact",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Jackson Grocery Store",
    description:
      "Reach out to Jackson Grocery Store, Dehradun, for orders, questions, or support.",
    images: [
      "https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png",
    ],
  },
  other: {
    'ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'GroceryStore',
      name: "Jackson Grocery Store",
      url: "https://jackson-grocery.com/contact",
      telephone: "+91 74172 29660",
      address: {
        '@type': 'PostalAddress',
        streetAddress: "1 Municipal Road, Dalanwala",
        addressLocality: "Dehradun",
        addressRegion: "Uttarakhand",
        postalCode: "248001",
        addressCountry: "IN",
      },
      image: "https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png",
      email: "omsairetail3@gmail.com"
    }),
  },
};

import ContactForm from "@/components/ContactForm";
import BusinessInfo from "@/components/BusinessInfo";
export default function ContactPage() {
  return (
    <main className="pt-[5.5rem] min-h-screen bg-white">
      <ContactForm />
      <BusinessInfo />
    </main>
  );
}