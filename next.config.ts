import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server is bound on every interface. Browsers that open it as
  // 127.0.0.1 must still be allowed to load /_next resources.
  allowedDevOrigins: ["127.0.0.1"],
  devIndicators: false,
};

export default nextConfig;
