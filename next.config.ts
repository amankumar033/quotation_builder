import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Do not fail production builds on ESLint warnings/errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
