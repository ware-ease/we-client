'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from '@/i18n/routing';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Ensure this component only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect when `currentUser` is null
  useEffect(() => {
    if (isClient && currentUser === null) {
      router.push('/login');
    }
  }, [currentUser, router, isClient]);

  if (!isClient || currentUser === undefined) {
    return (
      <div className='flex justify-center items-center h-screen w-screen'>
        <div className='w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin'></div>
      </div>
    );
  }

  return <>{currentUser ? children : null}</>;
};

export default ProtectedRoute;
