
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromCookie } from './lib/session';
 
const publicRoutes = ['/login', '/projects'];

const protectedRoutes = [
    '/',
    '/accessories',
    '/materials',
    '/printer-profiles',
    '/electricity-profiles',
    '/sales-profiles',
    '/projects/calculate',
    '/projects/edit',
    '/materials/edit',
    '/materials/new',
    '/accessories/edit',
    '/accessories/new',
    '/printer-profiles/edit',
    '/printer-profiles/new',
    '/electricity-profiles/edit',
    '/electricity-profiles/new',
    '/sales-profiles/edit',
    '/sales-profiles/new',
];

function isProtected(pathname: string): boolean {
  if (pathname === '/') return true; // Root is always protected
  return protectedRoutes.some(route => pathname.startsWith(route));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await getSessionFromCookie(request.cookies);

  // If user is authenticated and tries to access login, redirect to home
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/projects', request.url));
  }
  
  // If user is not authenticated and tries to access a protected route
  if (!session && isProtected(pathname) && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
 
export const config = {
  // Matcher ignoring `_next/` and `api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
