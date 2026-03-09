import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  const token = request.cookies.get('shopease_token')?.value;

  const { pathname } = request.nextUrl;

  // 2. Protected routes
  if (pathname.startsWith('/profile') || pathname.startsWith('/checkout')) {
    if (!token) {
      // 3. Redirect to login if token not found
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callback', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// 4. Middleware matcher
export const config = {
  matcher: ['/profile/:path*', '/checkout/:path*'],
};