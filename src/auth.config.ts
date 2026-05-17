import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

const googleProvider = Google({
  clientId: process.env.AUTH_GOOGLE_ID!,
  clientSecret: process.env.AUTH_GOOGLE_SECRET!,
})
googleProvider.clientId = googleProvider.options!.clientId
googleProvider.clientSecret = googleProvider.options!.clientSecret

export const authConfig = {
  providers: [googleProvider],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name:
        process.env.PROJECT_ENV === "development"
          ? "authjs.session-token"
          : "__Secure-authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.PROJECT_ENV !== "development",
      },
    },
  },
  trustHost: true,
  debug: process.env.PROJECT_ENV === "development",
} satisfies NextAuthConfig
