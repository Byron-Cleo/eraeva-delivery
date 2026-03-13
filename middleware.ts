import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/place-order/,
    /\/profile/,
    /\/user\/(.*)/,
    /\/order\/(.*)/,
    /\/admin/,
  ];
  const secret = process.env.NEXTAUTH_SECRET;
  let token;
  if ((process.env.PROJECT_ENV as string) === "development") {
    token = await getToken({
      req: request,
      secret: secret,
      cookieName: "authjs.session-token",
    });
  } else {
    token = await getToken({
      req: request,
      secret: secret,
      cookieName: "__Secure-authjs.session-token",
    });
  }
  // console.log("TTTTT====>>>>", token);
  //check the user is logged in or not logged in by using request's cookies
  //it identifies the logged in and not yet logged in user
  // const sessionToken = request.cookies.get("authjs.session-token")?.value;
  // const isAuthenticated = Boolean(sessionToken);
  // const session = await auth()
  const { pathname } = request.nextUrl;
  // Optional: Redirect authenticated users away from the login page and redirect to their destinatin
  // if (!isAuthenticated && protectedPaths.some((p) => p.test(pathname))) {
  if (!token && protectedPaths.some((p) => p.test(pathname))) {
    const signinUrl = new URL("/sign-in", request.url);
    signinUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

    return NextResponse.redirect(signinUrl);
  }

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
