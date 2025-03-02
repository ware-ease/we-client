'use client';
import { useAuth } from '@/app/_components/providers/AuthProvider';
import React from 'react';

const Dashboard = () => {
  const { permissions } = useAuth();

  return (
    <div>
      {permissions.map((p, index) => (
        <div key={index}>{p.key}</div>
      ))}
    </div>
  );
};

export default Dashboard;
