// import  { auth } from "@/auth";

// export const middleware = auth;

import { NextResponse } from "next/server";
// import {cookies } from "next/headers";

export function middleware(request: Request) {
  // console.log("MMMM===>>> request object", request);
  //check for session cart cookie
  if (!request.cookies.get("sessionCartId")) {
    // Generate  new session cart id cookie
    const sessionCartId = crypto.randomUUID();

    //clone the request headers
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
  } else {
    // return true;
    return NextResponse.next();
  }
}
