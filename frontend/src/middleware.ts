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
  verification_status: "verified" | "unverified" | "not_submitted" | "reject";
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
    console.log(err)

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

// Routes that authenticated users should NOT access
const publicOnlyRoutes = [
  '/login',
  '/signup',
  '/register',
  '/',
  '/forget-password',
  '/forget-password/verify-code',
  '/forget-password/reset-password',
];

function isPublicOnlyRoute(pathname: string): boolean {
  return publicOnlyRoutes.some(route => {
    // Exact match for root
    if (route === '/' && pathname === '/') return true;
    
    // For other routes, check if pathname starts with the route
    if (route !== '/' && pathname.startsWith(route)) return true;
    
    return false;
  });
}

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

function getRedirectPathForRole(role: string): string {
  switch (role) {
    case 'student':
      return '/student';
    case 'teacher':
      return '/trainer';
    case 'admin':
      return '/dashboard';
    default:
      return '/login';
  }
}

// Check if teacher has access to dashboard based on verification status
function canTeacherAccessDashboard(verificationStatus: string): boolean {
  // Only allow verified teachers to access dashboard
  return verificationStatus === 'verified';
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
  
  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/auth')
  ) {
    return NextResponse.next();
  }

  // Get decoded token
  const decoded = getDecodedToken(request);
  
  // ============================================
  // HANDLE PUBLIC-ONLY ROUTES (when user IS authenticated)
  // ============================================
  if (decoded && isPublicOnlyRoute(pathname)) {
    // User is authenticated but trying to access public-only routes
    // Redirect them to their appropriate dashboard
    const redirectPath = getRedirectPathForRole(decoded.role);
    const redirectUrl = new URL(redirectPath, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // ============================================
  // HANDLE PROTECTED ROUTES (when user is NOT authenticated)
  // ============================================
  const protectedRoutes = ['/student', '/trainer', '/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // If it's a protected route and user is NOT authenticated
  if (isProtectedRoute && !decoded) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ============================================
  // HANDLE TEACHER VERIFICATION STATUS
  // ============================================
  if (decoded && decoded.role === 'teacher' && pathname.startsWith('/dashboard')) {
    // Check if teacher has proper verification status
    if (!canTeacherAccessDashboard(decoded.verification_status)) {
      // Redirect unverified/rejected/not_submitted teachers to trainer page
      const trainerUrl = new URL('/trainer', request.url);
      
      // Optional: Add a query parameter to show a message on the trainer page
      if (decoded.verification_status === 'not_submitted') {
        trainerUrl.searchParams.set('message', 'verification_required');
      } else if (decoded.verification_status === 'reject') {
        trainerUrl.searchParams.set('message', 'verification_rejected');
      } else if (decoded.verification_status === 'unverified') {
        trainerUrl.searchParams.set('message', 'verification_pending');
      }
      
      return NextResponse.redirect(trainerUrl);
    }
  }

  // ============================================
  // HANDLE AUTHORIZATION (user IS authenticated)
  // ============================================
  if (decoded && isProtectedRoute) {
    // Check if user has access to the current route (AUTHORIZATION CHECK)
    if (!isRouteAllowed(pathname, decoded.role)) {
      // Redirect to appropriate dashboard based on role
      const redirectPath = getRedirectPathForRole(decoded.role);
      const redirectUrl = new URL(redirectPath, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // User is either:
  // 1. Accessing a truly public route (not in publicOnlyRoutes)
  // 2. Authenticated and authorized for a protected route
  // 3. Not authenticated and accessing a public route
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