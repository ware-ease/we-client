'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { useRouter } from '@/lib/i18n/routing';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  // const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // useEffect(() => {
  //   const viewPermissions = permissions?.filter((p) => {
  //     const segments = p.code.split(':');
  //     return segments[segments.length - 1] === 'view';
  //   });
  //   const hasPerm = viewPermissions?.find((p) => p.url === pathname);
  //   if (!hasPerm) {
  //     router.push('/home');
  //   }
  // }, [pathname, permissions, router]);

  useEffect(() => {
    if (isClient && currentUser === null) {
      router.push('/login');
    }
  }, [currentUser, router, isClient]);

  if (!isClient || currentUser === undefined) {
    return (
      <div className='flex justify-center items-center h-screen w-screen'>
        <Loading />
      </div>
    );
  }

  return <>{currentUser ? children : null}</>;
};

export default ProtectedRoute;
