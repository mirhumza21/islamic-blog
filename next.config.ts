import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Show the picture when it is opened in a new tab instead of downloading it.
    // The default image CSP includes `sandbox`, which makes browsers download the file.
    contentDispositionType: "inline",
    contentSecurityPolicy: "script-src 'none'; frame-src 'none';",
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
