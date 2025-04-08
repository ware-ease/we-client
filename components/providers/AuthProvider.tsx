'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account } from '@/types/account';
import { Permission } from '@/types/permission';
import { getCurrentUser, login } from '@/services/authService';
import { LoginRequest } from '@/types/request/login';
import { AxiosResponse } from 'axios';

type AuthContextType = {
  currentUser?: Account | undefined | null;
  permissions?: Permission[];
  handleLogin: (
    loginCredentials: LoginRequest
  ) => Promise<AxiosResponse<unknown, unknown>>;
  updateUser: () => void;
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
        setCurrentUser(null);
      }
    }

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const userRes = await getCurrentUser();
        const user: Account = userRes.data.data;
        const permsRes = [
          ...(user?.groups?.flatMap((group) => group.permissions) || []),
          ...(user?.permissions || []),
        ];
        setPermissions(permsRes);
      } catch {
        setPermissions([]);
      }
    }

    fetchPermissions();
  }, [currentUser]);

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

  async function updateUser() {
    try {
      const userRes = await getCurrentUser();
      setCurrentUser(userRes.data.data);
    } catch {
      setCurrentUser(undefined);
    }
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, permissions, handleLogin, updateUser }}
    >
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
