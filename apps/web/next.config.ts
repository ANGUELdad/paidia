import type { NextConfig } from "next";

/** API is proxied at runtime via `src/app/api/[...path]/route.ts` (ARMONIA_API_PROXY). */
const nextConfig: NextConfig = {
  // Avoid baking a localhost rewrite that breaks Vercel (`DNS_HOSTNAME_RESOLVED_PRIVATE`).
};

export default nextConfig;
