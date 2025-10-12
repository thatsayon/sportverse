import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "i.pinimg.com", "res.cloudinary.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "connect-src 'self' https://api.ballmastery.com",
              "img-src 'self' data: blob: https://images.unsplash.com https://i.pinimg.com https://res.cloudinary.com",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
            ]
              .join("; ")
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;