import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  // Consider the user "logged in" if either token exists —
  // an expired access token can still be silently refreshed client-side
  const isLoggedIn = Boolean(accessToken || refreshToken);

  const isAuthRoute = pathname === '/' || pathname === '/login' || pathname === '/register';
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const isProtectedRoute = pathname.startsWith('/dashboard');
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*'],
};