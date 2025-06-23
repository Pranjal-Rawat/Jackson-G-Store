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
  sameAs = []
}) {
  return {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "@id": url,
    name,
    url,
    logo,
    image: logo,
    telephone: phone,
    email,
    openingHours,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: city,
      addressRegion: state,
      postalCode,
      addressCountry: country
    },
    ...(sameAs.length > 0 && { sameAs })
  };
}

export function getProductJsonLD(product) {
  if (!product) return null;

  const {
    title,
    name,
    description,
    image,
    slug,
    category,
    price,
    stock,
    _id,
    sku
  } = product;

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: title || name || "Product",
    image: image || "",
    description: description || "View product details and buy online from Jackson Grocery Store.",
    sku: sku || _id || "",
    brand: {
      "@type": "Brand",
      name: "Jackson Grocery Store"
    },
    ...(category && { category }),
    offers: {
      "@type": "Offer",
      url: `https://jackson-grocery.com/products/${slug}`,
      priceCurrency: "INR",
      price: Number(price || 0),
      availability: (stock ?? 0) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  };
}

// ✅ NEW: Use this for category banners instead of Product to avoid validation errors
export function getCategoryBannerJsonLD({ title, description, slug }) {
  const url = `https://jackson-grocery.com/category/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url
  };
}

export function getCategoryJsonLD({ categorySlug, categoryName }) {
  const base = "https://jackson-grocery.com";
  const categoryPath = categorySlug === "products"
    ? `${base}/products`
    : `${base}/category/${categorySlug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${base}/`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryName,
        item: categoryPath
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
