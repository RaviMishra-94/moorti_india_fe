import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.ADMIN_API_URL || 'http://localhost:8000';

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (best compression), WebP as fallback — auto-negotiated
    // by the /_next/image optimizer for all <Image> components.
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
    remotePatterns: [
      {
        // Allow images from the deployed backend
        protocol: "https",
        hostname: "**",
        pathname: "/uploads/**",
      },
      {
        // Local dev
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${API_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
