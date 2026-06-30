import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost:3000",
    "192.168.0.19:3000",
    "192.168.0.12:3000",
    "192.168.0.12",
    "10.203.186.51",
    "192.168.0.19",
    "10.169.2.51"
  ],

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "blama.shop" }],
        destination: "https://www.blama.shop/:path*",
        permanent: true,
      },
    ]
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 768, 1024, 1200],
    minimumCacheTTL: 31536000,
    qualities: [10, 60, 75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.blama.shop",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|ico|woff|woff2|ttf|otf|mp4|webm)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
};

export default nextConfig;
