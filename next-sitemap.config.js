// next-sitemap.config.js

import clientPromise from './app/lib/mongodb.js';

export default {
  siteUrl: 'https://jackson-grocery.com',
  generateRobotsTxt: true,
  exclude: ['/cart', '/search'],

  transform: async (config, url) => ({
    loc: url,
    changefreq: url.includes('/products/') ? 'weekly' : 'monthly',
    priority: url === '/' ? 1.0 : url.includes('/category') ? 0.8 : 0.5,
    lastmod: new Date().toISOString(),
  }),

  additionalPaths: async () => {
    const client = await clientPromise;
    const db = client.db('jackson-grocery-store');

    const products = await db
      .collection('products')
      .find({ stock: { $gt: 0 } })
      .project({ slug: 1, updatedAt: 1, image: 1, title: 1 })
      .toArray();

    return products.map((p) => ({
      loc: `/products/${p.slug}`,
      lastmod: new Date(p.updatedAt).toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
      images: p.image
        ? [{ loc: p.image, caption: p.title }]
        : undefined,
    }));
  },
};
