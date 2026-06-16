import type { NextAuthConfig } from "next-auth"

type Role = "ADMIN" | "STAFF"

function isAdminSession(
  user: { role?: string } | undefined
): user is { role: Role } {
  return user?.role === "ADMIN" || user?.role === "STAFF"
}

export const authConfig: NextAuthConfig = {
  providers: [],
  trustHost: true,
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: { name: "ocean-admin.session-token" },
    callbackUrl: { name: "ocean-admin.callback-url" },
    csrfToken: { name: "ocean-admin.csrf-token" },
  },
  callbacks: {
    jwt({ token, user }) {
      if (user && "role" in user) {
        token["role"] = user.role
        token["userId"] = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token["role"]) {
        session.user.role = token["role"] as Role
      }
      if (token["userId"]) {
        session.user.id = token["userId"] as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = isAdminSession(auth?.user)
      const isLoginPage = nextUrl.pathname === "/login"

      if (!isLoggedIn && !isLoginPage) {
        return Response.redirect(new URL("/login", nextUrl.origin))
      }
      if (isLoggedIn && isLoginPage) {
        return Response.redirect(new URL("/dashboard", nextUrl.origin))
      }
      return true
    },
  },
  pages: { signIn: "/login" },
}
