'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { getRedirectPath, isProtectedRoute } from '@/app/config/routes';

interface ProtectedRouteWrapperProps {
  children: React.ReactNode;
}

/**
 * ProtectedRouteWrapper Component
 * - Checks if user is authenticated
 * - Redirects to login if accessing protected route without auth
 * - Redirects to dashboard if trying to access login while authenticated
 */
export const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if user is authenticated from Redux state
  // You can store isAuthenticated in Redux or use a token from localStorage
  const isAuthenticated = useSelector((state: any) => state.auth?.isAuthenticated || false);

  useEffect(() => {
    // Load authentication state from localStorage on client-side
    const loadAuthState = () => {
      const storedAuth = localStorage.getItem('isAuthenticated');
      const adminUser = localStorage.getItem('adminUser');
      
      // If we have admin user data, treat as authenticated
      if (adminUser) {
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      setIsLoaded(true);
    };

    loadAuthState();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const effectiveIsAuthenticated = isAuthenticated || storedAuth;

    // Get redirect path based on auth status
    const redirectPath = getRedirectPath(effectiveIsAuthenticated, pathname);

    if (redirectPath) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, pathname, router, isLoaded]);

  // Show loading state during initial load
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRouteWrapper;
