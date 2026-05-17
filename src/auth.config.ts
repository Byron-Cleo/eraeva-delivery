import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
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
  providers: [Google],
} satisfies NextAuthConfig
