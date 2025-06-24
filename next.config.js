// next.config.js (ESM compatible)
import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
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

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
