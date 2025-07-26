import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = req.nextauth.token;

    // Debug: Log token information
    console.log("Middleware token:", JSON.stringify(token, null, 2));
    console.log("User role:", token?.role);
    console.log("Path:", path);

    // Check if the path is admin-only and the user doesn't have admin role
    if (path.startsWith("/admin") && token?.role !== "admin") {
      console.log("Access denied, redirecting to /access-denied");
      return NextResponse.redirect(new URL("/access-denied", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Ensure they are authenticated before checking role
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
