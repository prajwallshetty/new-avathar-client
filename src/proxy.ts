import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const session = request.cookies.get("admin_session")?.value;
  const isAuthPage = request.nextUrl.pathname === "/admin/login";

  // If trying to access admin pages (excluding login)
  if (request.nextUrl.pathname.startsWith("/admin") && !isAuthPage) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const parsedSession = await decrypt(session);
      if (parsedSession.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch (err) {
      // Invalid token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // If trying to access login page while already authenticated
  if (isAuthPage && session) {
    try {
      const parsedSession = await decrypt(session);
      if (parsedSession.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch (err) {
      // Allow them to proceed to login if token is broken
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
