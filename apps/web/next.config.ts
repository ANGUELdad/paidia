import type { NextConfig } from "next";

/** API is proxied at runtime via `src/app/api/[...path]/route.ts` (ARMONIA_API_PROXY). */
const nextConfig: NextConfig = {
  // compress is on by default. Do not add localhost rewrites (Vercel DNS_HOSTNAME_RESOLVED_PRIVATE).
  experimental: {
    optimizePackageImports: ["zod"],
  },
};

export default nextConfig;
