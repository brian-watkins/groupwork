import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  outputFileTracingIncludes: {
    "src/**/*": ["generated/**/*"],
  },
}

export default nextConfig
