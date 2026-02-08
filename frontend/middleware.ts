import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings'];
// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route needs protection
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtected || isAuthRoute) {
    // Check session by calling backend /auth/me
    // Forward the cookie from the incoming request
    const cookie = request.headers.get('cookie') || '';
    try {
      const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/auth/me`, {
        headers: { cookie },
      });

      const isAuthenticated = res.ok;

      if (isProtected && !isAuthenticated) {
        // Redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (isAuthRoute && isAuthenticated) {
        // Already logged in, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      // Backend unreachable -- allow access to auth routes, block protected
      if (isProtected) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*', '/login', '/signup'],
};
