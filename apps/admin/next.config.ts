import { config } from "dotenv"
import { resolve } from "path"
import type { NextConfig } from "next"

config({ path: resolve(process.cwd(), "../../.env") })

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/db", "@workspace/shared"],
  serverExternalPackages: ["pg", "bcryptjs"],
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 30,
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.blob.vercel-storage.com" },
    ],
  },
}

export default nextConfig
