import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Configure image qualities for Next.js 16 compatibility
    qualities: [75, 85, 90, 95, 100],
    // Remote image domains (add if you use external images)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
