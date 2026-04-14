/**
 * Route Configuration
 * Defines public routes (accessible without authentication) and protected routes
 */

export const PUBLIC_ROUTES = [
  '/admin-login',
  '/admin-register', // if you have registration
];

export const PROTECTED_ROUTES = [
  '/dashboard',
  '/Add-Product',
  '/product-list',
  '/add-categories',
  '/all-categories',
  '/add-coupon',
  '/all-coupons',
  '/all-orders',
  '/all-users',
  '/order-details',
  '/order-tracking',
  '/update-category',
  '/update-product',
];

export const isPublicRoute = (pathname: string): boolean => {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route));
};

export const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(route));
};

export const getRedirectPath = (isAuthenticated: boolean, pathname: string): string | null => {
  // If user is authenticated and tries to access login page, redirect to dashboard
  if (isAuthenticated && pathname === '/admin-login') {
    return '/dashboard';
  }
  
  // If user is not authenticated and tries to access protected route, redirect to login
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    return '/admin-login';
  }
  
  // No redirect needed
  return null;
};
