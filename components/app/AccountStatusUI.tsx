import { accountStatusMap } from '@/lib/tanstack-table/customFilterFn';
import React from 'react';

interface StatusUIProps {
  status: number;
}

const AccountStatusUI: React.FC<StatusUIProps> = ({ status }) => {
  const statusInfo = accountStatusMap.find(
    (item) => item.status === status
  ) || {
    label: 'Đã bị khóa',
    color: 'bg-red-500',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-xl py-1 text-xs ${statusInfo.color} text-white font-medium`}
    >
      <span>{statusInfo.label}</span>
    </div>
  );
};

export default AccountStatusUI;
