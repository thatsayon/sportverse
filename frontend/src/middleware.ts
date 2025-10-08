import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  token_type: "access" | "refresh";
  exp: number;
  iat: number;
  jti: string;
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  profile_pic: string;
  role: "teacher" | "student" | "admin";
  verification_status: "verified" | "unverified";
}

// Helper function to get and decode JWT token
function getDecodedToken(request: NextRequest): DecodedToken | null {
  const token = request.cookies.get('access_token')?.value;
  
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check if token is expired
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    const err = error as Error

    return null;
  }
}

// Define route access rules
const routeAccessRules = {
  student: {
    allowed: ['/student'],
    denied: ['/trainer', '/dashboard']
  },
  teacher: {
    allowed: ['/trainer', '/dashboard'],
    denied: ['/student']
  },
  admin: {
    allowed: ['/dashboard'],
    denied: ['/student', '/trainer']
  }
};

function isRouteAllowed(pathname: string, role: string): boolean {
  const rules = routeAccessRules[role as keyof typeof routeAccessRules];
  
  if (!rules) return false;

  // Check if the path starts with any denied route
  const isDenied = rules.denied.some(deniedRoute => 
    pathname.startsWith(deniedRoute)
  );
  
  if (isDenied) return false;

  // Check if the path starts with any allowed route
  const isAllowed = rules.allowed.some(allowedRoute => 
    pathname.startsWith(allowedRoute)
  );

  return isAllowed;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Add debugging endpoint
  if (pathname === '/api/middleware-check') {
    return NextResponse.json({ 
      message: 'Middleware is running!', 
      timestamp: new Date().toISOString(),
      pathname: pathname
    });
  }
  
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/student', '/trainer', '/dashboard'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  
  // Skip middleware for public routes, API routes, and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/auth')
  ) {

    return NextResponse.next();
  }
  
  // If it's NOT a protected route, allow access
  if (!isProtectedRoute) {

    return NextResponse.next();
  }

  // This is a protected route - authentication required
  
  // Get decoded token
  const decoded = getDecodedToken(request);
  
  // If no valid token, redirect to login (AUTHENTICATION CHECK)
  if (!decoded) {

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }


  // Check if user has access to the current route (AUTHORIZATION CHECK)
  if (!isRouteAllowed(pathname, decoded.role)) {

    
    // Redirect to appropriate dashboard based on role
    let redirectPath = '/';
    
    switch (decoded.role) {
      case 'student':
        redirectPath = '/student';
        break;
      case 'teacher':
        redirectPath = '/trainer';
        break;
      case 'admin':
        redirectPath = '/dashboard';
        break;
      default:
        redirectPath = '/login';
    }
    
    const redirectUrl = new URL(redirectPath, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // User is authenticated and authorized - allow access
  return NextResponse.next();
}

// Configure which routes the middleware should run on
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