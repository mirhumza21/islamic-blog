import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Show the picture when it is opened in a new tab instead of downloading it.
    contentDispositionType: "inline",
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
