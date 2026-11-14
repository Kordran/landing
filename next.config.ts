import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server is bound on every interface. Browsers that open it as
  // 127.0.0.1 must still be allowed to load /_next resources.
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
