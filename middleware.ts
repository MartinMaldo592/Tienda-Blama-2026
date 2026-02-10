import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protección de rutas administrativas
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // SEO: Manejo de canonicals y noindex para URLs con parámetros en home y productos
  const { pathname, searchParams } = request.nextUrl;
  const isHome = pathname === "/";
  const isProductos = pathname === "/productos" || pathname === "/productos/";

  if ((isHome || isProductos) && searchParams.toString().length > 0) {
    response.headers.set("x-robots-tag", "noindex,follow");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blama.shop";
    const cleanPath = isProductos ? "/productos" : "/";
    response.headers.set("link", `<${siteUrl}${cleanPath}>; rel="canonical"`);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
