'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types/account';
import { Permission } from '@/lib/types/permission';
import { getCurrentUser } from '@/lib/services/authService';
import { getPermissions } from '@/lib/services/permissionService';

interface AuthContextType {
  currentUser: User | null;
  permissions: Permission[];
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  permissions: [],
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await getCurrentUser();
        setCurrentUser(response.data);
      } catch {
        setCurrentUser(null);
      }
    }

    async function fetchPermissions() {
      try {
        const permissionsQuery = await getPermissions();
        setPermissions(permissionsQuery);
      } catch {
        setPermissions([]);
      }
    }

    fetchCurrentUser();
    fetchPermissions();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, permissions }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the AuthContext
export const useAuth = () => useContext(AuthContext);
