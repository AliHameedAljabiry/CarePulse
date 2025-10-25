import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // your NextAuth helper from auth.ts
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

// Define which routes are protected
const protectedRoutes = [
  "/my-profile",
  "/register",
  "/admin",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip protection for non-protected paths
  if (!protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Get user session
  const session = await auth();

  if (!session?.user?.email) {
    console.warn("[middleware] No session found, redirecting to /");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Double-check user exists in the database
  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (dbUser.length === 0) {
    console.warn("[middleware] Session found but no DB user, redirecting");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Optional: check if user is active / approved
  const u = dbUser[0];
  if (u.status === "PENDING") {
    console.warn(`[middleware] User ${u.email} status ${u.status}, blocking access`);
    return NextResponse.redirect(new URL("/", req.url));
  }

  // All checks passed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match any route inside these protected areas
    "/my-profile/:path*",
    "/register/:path*",
    "/admin/:path*",
  ],
};
