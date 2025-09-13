import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@vercel/postgres"],
  // 图片优化配置
  images: {
    domains: ["localhost"],
    formats: ["image/webp", "image/avif"],
  },
}

export default nextConfig
