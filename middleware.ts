import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
    const isPublicPage =
      req.nextUrl.pathname === "/" ||
      req.nextUrl.pathname.startsWith("/posts") ||
      req.nextUrl.pathname.startsWith("/about");

    // Allow API auth routes
    if (isApiAuthRoute) {
      return NextResponse.next();
    }

    // Allow public pages
    if (isPublicPage) {
      return NextResponse.next();
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Redirect unauthenticated users to login for protected pages
    if (!isAuth && !isAuthPage) {
      const from = req.nextUrl.pathname;
      const loginUrl = new URL("/auth/login", req.url);

      if (from !== "/") {
        loginUrl.searchParams.set("callbackUrl", from);
      }

      return NextResponse.redirect(loginUrl);
    }

    // Check role-based access for admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const userRole = token?.role;
      if (userRole !== "admin" && userRole !== "moderator") {
        return NextResponse.redirect(
          new URL("/auth/error?error=AccessDenied", req.url),
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always return true here as we handle authorization in the middleware function above
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
