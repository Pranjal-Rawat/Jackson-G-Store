/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://jackson-grocery.com',
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
      }
    ],
  }
};
