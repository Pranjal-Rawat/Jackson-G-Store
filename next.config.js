/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Server Actions (v14+ syntax)
  experimental: {
    serverActions: {},
  },

  images: {
    domains: [
      'res.cloudinary.com', // Cloudinary images
      // add more if needed
    ],
  },
  // Optional: basePath, i18n, etc.
};

export default nextConfig;
