import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value || null;

  const protectedRoutes = [
    "/dashboard",
    "/categories",
    "/product-types",
    "/product-subtypes",
    "/products",
    "/authenticity"
  ];

  const isProtected = protectedRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/categories/:path*",
    "/product-types/:path*",
    "/product-subtypes/:path*",
    "/products/:path*",
    "/authenticity/:path*",
  ],
};
