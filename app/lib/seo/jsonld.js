// /lib/seo/jsonld.js

export function getHomeJsonLD({
  name = "Jackson Grocery Store",
  url = "https://jackson-grocery.com",
  phone = "+91 74172 29660",
  street = "1 Municipal Road",
  city = "Dalanwala",
  state = "Dehradun",
  postalCode = "248001",
  country = "IN",
  logo = "https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png",
  email = "omsairetail3@gmail.com",
  openingHours = "Mo-Su 08:00-21:00",
  sameAs = [] // Array of social links
}) {
  return {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    name,
    url,
    logo,
    telephone: phone,
    email,
    openingHours,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: city,
      addressRegion: state,
      postalCode,
      addressCountry: country,
    },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function getProductJsonLD(product) {
  if (!product) return null;
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title || product.name,
    image: product.image || "",
    description: product.description || "",
    sku: product.sku || product._id || "",
    brand: {
      "@type": "Brand",
      name: "Jackson Grocery Store"
    },
    ...(product.category && { category: product.category }),
    offers: {
      "@type": "Offer",
      url: `https://jackson-grocery.com/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.price || 0,
      availability: (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  };
}

export function getCategoryJsonLD({ categorySlug, categoryName }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://jackson-grocery.com/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: categorySlug === "products"
          ? "https://jackson-grocery.com/products"
          : `https://jackson-grocery.com/category/${categorySlug}`
      }
    ]
  };
}

export function getFaqJsonLD(faqList) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    }))
  };
}
