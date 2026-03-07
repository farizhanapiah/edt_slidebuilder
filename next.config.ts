import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
    unoptimized: false,
  },
  // Allow the Puppeteer preview page to render without strict CSP
  async headers() {
    return [
      {
        source: "/decks/:deckId/preview",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
