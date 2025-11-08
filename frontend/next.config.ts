import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "i.pinimg.com", "res.cloudinary.com"],
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src *;
              script-src * 'unsafe-inline' 'unsafe-eval';
              style-src * 'unsafe-inline';
              img-src * data: blob:;
              media-src *;
              connect-src *;
              font-src *;
            `.replace(/\s{2,}/g, ' '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
