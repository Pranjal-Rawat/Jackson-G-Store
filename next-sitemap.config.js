// next-sitemap.config.js
import clientPromise from './app/lib/mongodb.js';

export default {
  siteUrl: 'https://jackson-grocery.com',
  generateRobotsTxt: true,
  exclude: ['/cart', '/search'],
  transform: async (config, url) => {
    // custom logic per-URL here
    return {
      loc: url,
      changefreq: url.includes('/products/') ? 'weekly' : 'monthly',
      priority: url === '/' ? 1.0 : url.includes('/category') ? 0.8 : 0.5,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async (config) => {
    const client = await clientPromise;
    const products = await client
      .db('jackson-grocery-store')
      .collection('products')
      .find({ stock: { $gt: 0 } })
      .project({ slug: 1, updatedAt: 1, image: 1, title: 1 })
      .toArray();

    return products.map((p) => ({
      loc: `/products/${p.slug}`,
      lastmod: p.updatedAt.toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
      images: [
        {
          loc: p.image,
          caption: p.title,
        },
      ],
    }));
  },
};
