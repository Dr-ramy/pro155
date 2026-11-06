import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuth = !!token;

  const url = req.nextUrl.clone();

  // قائمة المسارات المحمية
  const protectedPaths = ["/dashboard", "/content", "/profile"];
  const isProtected = protectedPaths.some(path =>
    url.pathname.startsWith(path)
  );

  if (isProtected && !isAuth) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
