'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account } from '@/lib/types/account';
import { Permission } from '@/lib/types/permission';
import {
  getCurrentUser,
  login,
  refreshTokens,
} from '@/lib/services/authService';
import { getPermissions } from '@/lib/services/permissionService';
import { LoginRequest } from '@/lib/types/request/login';
import { AxiosResponse } from 'axios';

type AuthContextType = {
  currentUser?: Account | undefined | null;
  permissions?: Permission[];
  handleLogin: (
    loginCredentials: LoginRequest
  ) => Promise<AxiosResponse<unknown, unknown>>;
  // handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<Account | undefined | null>(
    undefined
  );
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const userRes = await getCurrentUser();
        setCurrentUser(userRes.data.data);
      } catch {
        setCurrentUser(undefined);
        try {
          const tokenRes = await refreshTokens();
          if (tokenRes.status === 200) {
            const userRes = await getCurrentUser();
            setCurrentUser(userRes.data.data);
          }
        } catch {
          setCurrentUser(null);
        }
      }
    }

    async function fetchPermissions() {
      try {
        const permsRes = await getPermissions();
        setPermissions(permsRes);
      } catch {
        setPermissions([]);
      }
    }

    fetchCurrentUser();
    fetchPermissions();
  }, []);

  async function handleLogin(loginCredentials: LoginRequest) {
    const res = await login(loginCredentials);
    if (res.status === 200) {
      try {
        const userRes = await getCurrentUser();
        setCurrentUser(userRes.data.data);
      } catch {
        setCurrentUser(undefined);
      }
    }
    return res;
  }

  return (
    <AuthContext.Provider value={{ currentUser, permissions, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
