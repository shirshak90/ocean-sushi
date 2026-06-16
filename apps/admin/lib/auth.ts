import NextAuth, { type NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db, users } from "@workspace/db"
import { eq } from "drizzle-orm"
import { LoginSchema } from "@workspace/shared/schemas"
import { authConfig } from "./auth.config"

type Role = "ADMIN" | "STAFF"

declare module "next-auth" {
  interface User {
    role: Role
  }
  interface Session {
    user: {
      id: string
      name: string | null
      email: string
      role: Role
    }
  }
}

const config: NextAuthConfig = {
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, parsed.data.email),
          columns: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
          },
        })
        if (!user) return null

        const valid = await bcrypt.compare(parsed.data.password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as Role,
        }
      },
    }),
  ],
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)
