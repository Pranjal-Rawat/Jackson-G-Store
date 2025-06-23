export default function LocalBusinessLDJson() {
  const ldjson = {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    name: "Jackson Grocery Store",
    image: "https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png",
    "@id": "https://jackson-grocery.com",
    url: "https://jackson-grocery.com",
    telephone: "+91 74172 29660",
    email: "omsairetail3@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1 Municipal Road",
      addressLocality: "Dehradun",
      addressRegion: "Uttarakhand",
      postalCode: "248001",
      addressCountry: "IN"
    },
    openingHours: "Mo-Su 08:00-21:00",
    priceRange: "₹",
    sameAs: [
      "https://www.facebook.com/jacksongrocerystore",
      "https://www.instagram.com/jacksongrocerystore"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
      key="local-business-ldjson"
    />
  );
}
