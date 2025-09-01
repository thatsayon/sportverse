import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "i.pinimg.com", // ✅ allow Pinterest images
    ], // allow this hostname for next/image
  },
};

export default nextConfig;