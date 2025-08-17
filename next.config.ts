import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // for now ..
    // we'll change this later for protection
    remotePatterns: [
      {
        protocol: "https", // or 'http' if needed, but 'https' is recommended
        hostname: "**", // This wildcard allows all hostnames
      },
    ],
  },
};

export default nextConfig;
