import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      {
        source: "/catalog/cold-rooms",
        destination: "/catalog",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kerurdan.co.il",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "pinyrmmysvagystjfonv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "wunisbfgiyyarlamvfhu.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
