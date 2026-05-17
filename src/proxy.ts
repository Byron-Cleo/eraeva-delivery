import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

const protectedPaths = [
  /\/shipping-address/,
  /\/payment-method/,
  /\/place-order/,
  /\/profile/,
  /\/user\/(.*)/,
  /\/order\/(.*)/,
  /\/admin/,
  /\/dashboard/,
];

function needsProtection(pathname: string): boolean {
  return protectedPaths.some((p) => p.test(pathname));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Session cart cookie for all visitors
  if (!request.cookies.get("sessionCartId")) {
    const sessionCartId = crypto.randomUUID();
    const newRequestHeaders = new Headers(request.headers);
    const response = NextResponse.next({
      request: { headers: newRequestHeaders },
    });
    response.cookies.set("sessionCartId", sessionCartId);
    return response;
  }

  // Auth protection
  if (needsProtection(pathname)) {
    if (!secret) {
      return NextResponse.next();
    }
    const cookieName =
      process.env.PROJECT_ENV === "development"
        ? "authjs.session-token"
        : "__Secure-authjs.session-token";
    const token = await getToken({ req: request, secret, cookieName });
    if (!token) {
      const signinUrl = new URL("/sign-in", request.url);
      signinUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signinUrl);
    }
  }

  return NextResponse.next();
}
