import path from "path";
import type { NextConfig } from "next";
import { legacyWordPressRedirects } from "./src/lib/legacy-wordpress-redirects";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  allowedDevOrigins: ["*.devtunnels.ms"],
  async redirects() {
    return [
      {
        source: "/catalog/cold-rooms",
        destination: "/catalog",
        permanent: true,
      },
      ...legacyWordPressRedirects,
    ];
  },
  images: {
    unoptimized: true,
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
