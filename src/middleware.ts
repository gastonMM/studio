import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionFromCookie } from './lib/session';
 
// The list of all public routes that don't require authentication
const publicRoutes = ['/login', '/projects'];
const protectedRoutes = [
    '/',
    '/accessories',
    '/materials',
    '/printer-profiles',
    '/electricity-profiles',
    '/sales-profiles',
    '/projects/calculate',
    /^\/projects\/edit\/.*$/, // Regex for edit pages
    /^\/materials\/edit\/.*$/,
    /^\/materials\/new\/?$/,
    /^\/accessories\/edit\/.*$/,
    /^\/accessories\/new\/?$/,
    /^\/printer-profiles\/edit\/.*$/,
    /^\/printer-profiles\/new\/?$/,
    /^\/electricity-profiles\/edit\/.*$/,
    /^\/electricity-profiles\/new\/?$/,
    /^\/sales-profiles\/edit\/.*$/,
    /^\/sales-profiles\/new\/?$/,
];

function isPublic(pathname: string): boolean {
    return publicRoutes.some(route => {
        if (typeof route === 'string') {
            return pathname === route;
        }
        return route.test(pathname);
    });
}
function isProtected(pathname: string): boolean {
    if (pathname === '/') return true; // Root is always protected
     return protectedRoutes.some(route => {
        if (typeof route === 'string') {
            return pathname.startsWith(route) && pathname !== '/projects';
        }
        return route.test(pathname);
    });
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await getSessionFromCookie(request.cookies);

  // If user is authenticated
  if (session) {
    // If user is on the login page, redirect to projects
    if (pathname === '/login') {
      return NextResponse.redirect(new URL('/projects', request.url))
    }
    // Otherwise, allow access
    return NextResponse.next()
  }

  // If user is not authenticated
  // and is trying to access a protected route
  if (isProtected(pathname) && !isPublic(pathname)) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Allow access to public routes
  return NextResponse.next()
}
 
export const config = {
  // Matcher ignoring `_next/` and `api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
