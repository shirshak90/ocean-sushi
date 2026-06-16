import NextAuth, { type NextAuthResult } from "next-auth"
import { authConfig } from "@/lib/auth.config"

const result: NextAuthResult = NextAuth(authConfig)
const proxy: NextAuthResult["auth"] = result.auth

export { proxy }
export default proxy

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public|login).*)"],
}
