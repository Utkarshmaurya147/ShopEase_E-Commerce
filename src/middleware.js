import { NextResponse } from 'next/server';

export function middleware(request) {
  // 1. Get the token from the cookies
  // Note: Match this name exactly to what you used in your backend (shopease_token)
  const token = request.cookies.get('shopease_token')?.value;

  const { pathname } = request.nextUrl;

  // 2. Define protected routes
  if (pathname.startsWith('/profile') || pathname.startsWith('/checkout')) {
    if (!token) {
      // 3. Redirect to login if no token is found
      const loginUrl = new URL('/login', request.url);
      // Optional: Add a 'callback' so they return here after logging in
      loginUrl.searchParams.set('callback', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// 4. Matcher tells Next.js exactly which routes to run this on
export const config = {
  matcher: ['/profile/:path*', '/checkout/:path*'],
};