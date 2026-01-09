import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const isProductos = pathname === "/productos" || pathname === "/productos/";

  if (!isProductos) return NextResponse.next();

  const shouldNoindex = searchParams.toString().length > 0;

  if (!shouldNoindex) return NextResponse.next();

  const response = NextResponse.next();
  response.headers.set("x-robots-tag", "noindex,follow");
  return response;
}

export const config = {
  matcher: ["/productos/:path*"],
};
