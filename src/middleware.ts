import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware is now minimal - authentication is handled client-side via ProtectedRouteWrapper
 * This middleware just allows all requests to pass through
 */
export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  // Authentication is handled client-side in ProtectedRouteWrapper component
  return NextResponse.next();
}

// Simplified matcher - middleware is minimal now
export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};