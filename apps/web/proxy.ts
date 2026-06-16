import NextAuth, { type NextAuthResult } from "next-auth"
import { authConfig } from "@/lib/auth.config"

const result: NextAuthResult = NextAuth(authConfig)
const proxy: NextAuthResult["auth"] = result.auth

export { proxy }
export default proxy

export const config = { matcher: ["/profile/:path*"] }
