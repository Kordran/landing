import type { NextConfig } from "next";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const indexingEnabled = process.env.INDEXING_ENABLED === "true";

const indexNowKey = process.env.INDEXNOW_KEY?.trim();
if (indexNowKey && /^[A-Za-z0-9-]{8,128}$/.test(indexNowKey)) {
  const dir = join(process.cwd(), "public");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${indexNowKey}.txt`), indexNowKey);
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const noindexHeader = {
  key: "X-Robots-Tag",
  value: "noindex, nofollow, noarchive",
};

const nextConfig: NextConfig = {
  trailingSlash: false,
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "www.kordran.com" }],
        destination: "https://kordran.com",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kordran.com" }],
        destination: "https://kordran.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: "/", headers: securityHeaders },
      {
        source: "/:path+",
        headers: indexingEnabled
          ? securityHeaders
          : [...securityHeaders, noindexHeader],
      },
    ];
  },
};

export default nextConfig;
