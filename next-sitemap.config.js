/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: 'https://jackson-grocery.com',   // no trailing slash
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/cart', '/search'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cart', '/search'],
      },
    ],
  },
};
