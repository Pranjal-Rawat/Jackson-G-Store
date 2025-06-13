/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      enable: true, // ✅ Updated structure
    },
  },
  images: {
    domains: [
      'res.cloudinary.com', // 👈 Allow Cloudinary images
    ],
  },
};

export default nextConfig;
