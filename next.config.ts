import path from "path";
import type { NextConfig } from "next";
import { legacyWordPressRedirects } from "./src/lib/legacy-wordpress-redirects";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  allowedDevOrigins: ["*.devtunnels.ms"],
  /** Legacy WordPress URLs keep trailing slashes; match them in one redirect hop. */
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "kerurdan.co.il" }],
        destination: "https://www.kerurdan.co.il/:path*",
        permanent: true,
      },
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
