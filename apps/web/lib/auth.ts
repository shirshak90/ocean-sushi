import NextAuth, { type NextAuthConfig, type NextAuthResult } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db, customers } from "@workspace/db"
import { eq } from "drizzle-orm"
import { LoginSchema } from "@workspace/shared/schemas"
import { authConfig } from "./auth.config"

declare module "next-auth" {
  interface User {
    firstName: string
    lastName: string
    phone: string
  }
  interface Session {
    user: {
      id: string
      name: string | null
      email: string
      firstName: string
      lastName: string
      phone: string
    }
  }
}

const config: NextAuthConfig = {
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials)
        if (!parsed.success) return null
        const customer = await db.query.customers.findFirst({
          where: eq(customers.email, parsed.data.email),
        })
        if (!customer?.password) return null
        const valid = await bcrypt.compare(
          parsed.data.password,
          customer.password
        )
        if (!valid) return null
        return {
          id: customer.id,
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
        }
      },
    }),
  ],
}

const result: NextAuthResult = NextAuth(config)
export const handlers: NextAuthResult["handlers"] = result.handlers
export const auth: NextAuthResult["auth"] = result.auth
export const signIn: NextAuthResult["signIn"] = result.signIn
export const signOut: NextAuthResult["signOut"] = result.signOut
