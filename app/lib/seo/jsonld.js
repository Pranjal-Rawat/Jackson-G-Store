export function getCategoryJsonLD({ categorySlug, categoryName }) {
  const base = "https://jackson-grocery.com";
  const categoryPath = categorySlug === "products"
    ? `${base}/products`
    : `${base}/category/${categorySlug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} – Jackson Grocery Store`,
    description: `Buy fresh ${categoryName} online in Dehradun at Jackson Grocery Store.`,
    url: categoryPath,
    breadcrumb: {
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
    }
  };
}
