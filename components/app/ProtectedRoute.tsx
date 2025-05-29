'use client';
import { Group } from '@/types/account';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Define allowed routes per groupId (as strings)
  const routePermissions: Record<string, string[]> = {
    '1': ['/vi'], // Allow everything (root prefix covers all /vi/* routes)
    '2': ['/vi'], // Allow everything except /vi/accounts
    '4': [
      '/vi/suppliers',
      '/vi/customers',
      '/vi/requests',
      '/vi/settings',
      '/vi/home',
    ],
    '3': ['/vi/home', '/vi/tasks'],
  };

  // Check if the current pathname is allowed for the given groupId
  const isRouteAllowedForGroup = (groupId: string, path: string): boolean => {
    if (groupId === '1') {
      return true; // Group 1 allows everything
    }
    if (groupId === '2') {
      // Group 2 allows everything except /vi/accounts and its subroutes
      return !path.startsWith('/vi/accounts');
    }
    // For groups 3 and 4, check if the path starts with any allowed prefix
    const allowedPrefixes = routePermissions[groupId] || [];
    return allowedPrefixes.some((prefix) => path.startsWith(prefix));
  };

  // Check if the user is allowed to access the current route
  const isRouteAllowed = (groups: Group[], path: string): boolean => {
    // If no groups, deny access
    if (!groups || groups.length === 0) {
      return false;
    }
    // Allow if any group permits the route
    return groups.some((group) => isRouteAllowedForGroup(group.id, path));
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || currentUser === undefined) return;

    if (currentUser === null) {
      router.push('/vi/login');
      return;
    }

    // Authenticated user: check route permissions based on Groups
    if (!isRouteAllowed(currentUser.groups, pathname)) {
      // Unauthorized route: redirect to /vi/home
      router.push('/vi/home');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, router, pathname, isClient]);

  if (!isClient || currentUser === undefined) {
    return (
      <div className='flex justify-center items-center h-screen w-screen'>
        <Loading />
      </div>
    );
  }

  // Render children only if authenticated and authorized
  return (
    <>
      {currentUser && isRouteAllowed(currentUser.groups, pathname)
        ? children
        : null}
    </>
  );
};

export default ProtectedRoute;
