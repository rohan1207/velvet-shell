import { NextResponse } from 'next/server';

/**
 * Temporary: client preview is homepage-only.
 * All app routes redirect to `/` until other pages are ready.
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
