import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-token";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (token) {
    try {
      await verifySessionToken(token);
      return NextResponse.next();
    } catch {
      // Invalid sessions follow the same path as an absent session.
    }
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "from",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: "/dashboard/:path*",
};
