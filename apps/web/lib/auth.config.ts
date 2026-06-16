import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  providers: [],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: { name: "ocean-web.session-token" },
    callbackUrl: { name: "ocean-web.callback-url" },
    csrfToken: { name: "ocean-web.csrf-token" },
  },
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user && "firstName" in user) {
        token.customerId = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.phone = user.phone
      }
      return token
    },
    session({ session, token }) {
      if (token.customerId) {
        session.user.id = token.customerId as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.phone = token.phone as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user?.id
      if (!isLoggedIn) {
        const url = new URL("/login", nextUrl.origin)
        url.searchParams.set("from", nextUrl.pathname)
        return Response.redirect(url)
      }
      return true
    },
  },
}
