/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enable: true, // ✅ Updated structure
    },
  },
};

export default nextConfig;
