import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io", // ✅ Allow images from Sanity
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Optional: If you still use any unsplash placeholder images
      }
    ],
  },
};

export default nextConfig;