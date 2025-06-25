// /lib/seo/jsonld.js
// -------------------------------------------------------------------
// JSON-LD helpers for Jackson Grocery Store
// -------------------------------------------------------------------

/* ---------- 1. Store (LocalBusiness) ---------- */
export function getHomeJsonLD({
  name = 'Jackson Grocery Store',
  url = 'https://jackson-grocery.com',
  phone = '+91 74172 29660',
  street = '1 Municipal Road',
  city = 'Dalanwala',
  state = 'Dehradun',
  postalCode = '248001',
  country = 'IN',
  logo = 'https://res.cloudinary.com/dy1uhnjnq/image/upload/v1749755125/Jackson_Logo_page-0001-removebg-preview_yqeopv.png',
  email = 'omsairetail3@gmail.com',
  openingHours = 'Mo-Su 08:00-21:00',
  sameAs = []
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'GroceryStore',
    '@id': url,          // canonical ID
    name,
    url,
    logo,
    image: logo,
    telephone: phone,
    email,
    openingHours,
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: city,
      addressRegion: state,
      postalCode,
      addressCountry: country
    },
    ...(sameAs.length && { sameAs })
  };
}

/* ---------- 2. Product ---------- */
export function getProductJsonLD(product = {}) {
  const {
    title,
    name,
    description = 'View product details and buy online from Jackson Grocery Store.',
    image,
    slug,
    category,
    price,
    stock,
    _id,
    sku
  } = product;

  // Bail out if we’re missing ANY required property – avoids “invalid item” flag
  if (!slug || !image || typeof price === 'undefined') return null;

  const baseUrl = 'https://jackson-grocery.com';
  const productUrl = `${baseUrl}/products/${slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title || name,
    description,
    image: Array.isArray(image) ? image : [image], // Google prefers array
    url: productUrl,
    sku: sku || _id || '',
    ...(category && { category }),
    brand: { '@type': 'Brand', name: 'Jackson Grocery Store' },

    /* --- Offer (all required fields present) --- */
    offers: {
      '@type': 'Offer',
      url: productUrl,
      price: Number(price).toFixed(2),      // "49.00" (string, 2-dp)
      priceCurrency: 'INR',
      availability:
        stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };
}

/* ---------- 3. Category breadcrumb ---------- */
export function getCategoryJsonLD({ categorySlug, categoryName }) {
  const base = 'https://jackson-grocery.com';
  const categoryUrl =
    categorySlug === 'products'
      ? `${base}/products`
      : `${base}/category/${categorySlug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${base}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryName,
        item: categoryUrl
      }
    ]
  };
}

/* ---------- 4. FAQ ---------- */
export function getFaqJsonLD(faqList = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqList.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    }))
  };
}
