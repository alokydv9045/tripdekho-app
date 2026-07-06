import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/profile', '/bookings', '/admin', '/vendor'];

// Paths that are role-specific
const rolePaths = {
  admin: ['/admin'],
  vendor: ['/vendor'],
};

/**
 * Validates that a cookie value is a real token, not an empty/cleared leftover.
 * A real JWT is always 20+ characters.
 */
function isValidToken(value: string | undefined): boolean {
  return !!(value && value.trim().length > 20);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Get tokens from cookies and validate they are real values
  const rawToken = request.cookies.get('token')?.value;
  const rawRole = request.cookies.get('role')?.value;
  
  const token = isValidToken(rawToken) ? rawToken : undefined;
  const role = (rawRole && rawRole.trim().length > 0) ? rawRole.trim() : undefined;

  // Public paths under /vendor that shouldn't require authentication
  const isVendorAuthPath = pathname === '/vendor/register';

  // 2. Check if the path is protected (exact match or prefix with slash to avoid matching /vendors when checking for /vendor)
  const isProtected = protectedPaths.some(path => pathname === path || pathname.startsWith(path + '/')) && !isVendorAuthPath;
  
  if (isProtected && !token) {
    // Redirect to login if trying to access a protected route without a token
    const url = new URL('/?auth=login', request.url);
    const fullPath = pathname + request.nextUrl.search;
    url.searchParams.set('from', fullPath);
    return NextResponse.redirect(url);
  }

  // 3. Role-based access control
  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/');
  const isVendorPath = (pathname === '/vendor' || pathname.startsWith('/vendor/')) && !isVendorAuthPath;

  if (isAdminPath) {
    const hasAdminAccess = role === 'super_admin' || role?.includes('_admin');
    if (!token || !hasAdminAccess) {
      const fullPath = pathname + request.nextUrl.search;
      return NextResponse.redirect(new URL('/?auth=login&from=' + encodeURIComponent(fullPath), request.url));
    }
  }

  if (isVendorPath) {
    const hasVendorAccess = role === 'vendor' || role === 'super_admin';
    if (!token || !hasVendorAccess) {
      const fullPath = pathname + request.nextUrl.search;
      return NextResponse.redirect(new URL('/?auth=login&from=' + encodeURIComponent(fullPath), request.url));
    }
  }


  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
