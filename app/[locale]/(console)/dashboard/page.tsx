'use client';
import { useAuth } from '@/app/_components/providers/AuthProvider';
import React from 'react';

const Dashboard = () => {
  const { permissions, currentUser } = useAuth();

  return (
    <div>
      {permissions?.map((p, index) => (
        <div key={index}>{p.key}</div>
      ))}
      <>{currentUser?.firstName}</>
    </div>
  );
};

export default Dashboard;
