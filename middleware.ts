import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/place-order/,
    /\/profile/,
    /\/user\/(.*)/,
    /\/order\/(.*)/,
    /\/admin/,
  ];
  //check the user is logged in or not logged in by using request's cookies
  //it identifies the logged in and not yet logged in user
  const sessionToken = request.cookies.get("authjs.session-token")?.value;
  const isAuthenticated = !!sessionToken;
  const { pathname } = request.nextUrl;
  // if (!isAuthenticated && protectedPaths.some((p) => p.test(pathname))) {
  //   return NextResponse.redirect(new URL("/sign-in", request.url));
  // }
  // Optional: Redirect authenticated users away from the login page and redirect to their destinatin
  if (isAuthenticated && protectedPaths.some((p) => p.test(pathname))) {
    return NextResponse.redirect(new URL(pathname, request.url));
  }
  // if (!isAuthenticated && protectedPaths.some((p) => p.test(pathname))) {
  //   return NextResponse.redirect(new URL("/sign-in", request.url));
  // }

  //check for session cart cookie
  if (!request.cookies.get("sessionCartId")) {
    // Generate  new session cart id cookie
    const sessionCartId = crypto.randomUUID();

    //clone the incoming request headers
    const newRequestHeaders = new Headers(request.headers);

    //create new response and add the new headers
    const response = NextResponse.next({
      request: {
        headers: newRequestHeaders,
      },
    });

    //set newly generated sessionCartId in the response cookies
    response.cookies.set("sessionCartId", sessionCartId);

    return response;
  }

  //Always go to the next response as normal working of request response cycle
  return NextResponse.next();
}

// Matches all paths except API routes, static files, and images
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
