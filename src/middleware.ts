
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromCookie } from './lib/session';
 
const protectedRoutes = [
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

function isProtectedRoute(pathname: string): boolean {
  // Check if the path starts with any of the protected routes.
  // This handles dynamic routes like /projects/edit/[id]
  for (const route of protectedRoutes) {
    if (pathname.startsWith(route)) {
      return true;
    }
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await getSessionFromCookie(request.cookies);

  // If user is authenticated and tries to access login, redirect to home
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/projects', request.url));
  }
  
  // If user is not authenticated and tries to access a protected route
  if (!session && isProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
