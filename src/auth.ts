import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { cookies } from "next/headers";
import { authConfig } from "./auth.config";

const hasSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

const config = hasSecret
  ? NextAuth({
      adapter: PrismaAdapter(prisma),
      ...authConfig,
      providers: [
        ...authConfig.providers,
        CredentialsProvider({
          credentials: {
            email: { type: "email" },
            password: { type: "password" },
          },
          async authorize(credentials) {
            if (credentials === null) return null;

            const user = await prisma.user.findFirst({
              where: { email: credentials.email as string },
            });

            if (user && user.password) {
              const isMatch = compareSync(
                credentials.password as string,
                user.password,
              );

              if (isMatch) {
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                };
              }
            }

            return null;
          },
        }),
      ],
      callbacks: {
        async session({ session, user, trigger, token }: any) {
          session.user.id = token.sub;
          session.user.role = token.role;
          session.user.name = token.name;
          session.user.image = token.picture;

          if (trigger === "update") {
            session.user.name = user.name;
          }

          return session;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, user, trigger, session }: any) {
          if (user) {
            token.sub = user.id;
            token.id = user.id;
            token.role = user.role;
            token.picture = user.image;

            if (user.name === null || user.name === "NO_NAME") {
              token.name = user.email.split("@")[0];

              await prisma.user.update({
                where: { id: user.id },
                data: { name: token.name },
              });
            }

            if (trigger === "signIn" || trigger === "signUp") {
              const cookiesObject = await cookies();
              const sessionCartId = cookiesObject.get("sessionCartId")?.value;

              if (sessionCartId) {
                const sessionCart = await prisma.cart.findFirst({
                  where: { sessionCartId },
                });
                if (sessionCart) {
                  await prisma.cart.deleteMany({ where: { userId: user.id } });

                  await prisma.cart.update({
                    where: { id: sessionCart.id },
                    data: { userId: user.id },
                  });
                }
              }
            }
          }

          if (session?.user?.name && trigger === "update") {
            token.name = session.user.name;
          }

          return token;
        },
      },
      events: {
        async signIn({ account, user }: any) {
          if (account?.provider === "google" && user.email) {
            await prisma.user.updateMany({
              where: { email: user.email, emailVerified: null },
              data: { emailVerified: new Date() },
            });
          }
        },
      },
    })
  : null;

const _handlerStub = async () => new Response(null, { status: 500 });
const _stub = async () => null;

export const { handlers, auth, signIn, signOut } = config ?? {
  handlers: { GET: _handlerStub, POST: _handlerStub },
  auth: _stub,
  signIn: _stub,
  signOut: _stub,
};
