import createMiddleware from 'next-intl/middleware';
// import { NextRequest, NextResponse } from 'next/server';
import { routing } from './lib/i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const intlMiddleware = createMiddleware(routing);
  const response = intlMiddleware(req);

  const { pathname } = req.nextUrl;

  if (pathname === '/' || pathname === '/vi') {
    const url = req.nextUrl.clone();
    url.pathname = '/vi/login';
    return NextResponse.redirect(url);
  }
  if (pathname === '/en') {
    const url = req.nextUrl.clone();
    url.pathname = '/en/login';
    return NextResponse.redirect(url);
  }

  return response;
}

// const publicRoutes = ['/login'];

// export default async function middleware(req: NextRequest) {
// Run next-intl middleware first (for localization)

// const pathname = req.nextUrl.pathname;
// const token = req.cookies.get('accessToken')?.value;

// // Allow public routes without authentication
// if (publicRoutes.includes(pathname.substring(3))) {
//   return response;
// }

// // If no token, redirect to login page
// if (!token || token === undefined || token === 'undefined') {
//   return NextResponse.redirect(
//     new URL(pathname.substring(0, 3) + '/login', req.url)
//   );
// }

//   try {
//     // Fetch user permissions from API
//     const res = await fetch('https://your-api.com/user/permissions', {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!res.ok) {
//       return NextResponse.redirect(new URL('/login', req.url)); // Invalid token
//     }

//     const { permissions } = await res.json();

//     // Check if user has permission for the current page
//     if (!permissions.includes(pathname)) {
//       return NextResponse.redirect(new URL('/403', req.url)); // Redirect to Access Denied page
//     }

//     return response;
//   } catch (error) {
//     console.error('Middleware error:', error);
//     return NextResponse.redirect(new URL('/login', req.url));
//   }
// }

// TODO: If have token and access "/", "/en", "/vi", "/login" then redirect to home page.

export const config = {
  matcher: ['/', '/(vi|en)/:path*'], // Keep your internationalized routes
};
