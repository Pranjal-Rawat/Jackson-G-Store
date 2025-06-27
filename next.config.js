// next.config.js (ESM compatible)
const nextConfig = {
  experimental: {
    serverActions: {},
  },
  images: {
    domains: ['res.cloudinary.com'],
    deviceSizes: [360, 420, 640, 768, 1024, 1200, 1600],
  },
  reactStrictMode: true,
};

export default nextConfig;
