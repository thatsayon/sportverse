import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      "images.unsplash.com",
      "i.pinimg.com",
      "res.cloudinary.com",
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Add security headers including relaxed CSP for external API
  async headers() {
    return [
      {
        source: "/(.*)", // apply to all routes
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src * blob: data:;
              connect-src 'self' https://api.ballmastery.com;
              font-src 'self' data:;
            `.replace(/\s{2,}/g, " "), // clean extra spaces
          },
        ],
      },
    ];
  },
};

export default nextConfig;
