import { statusMap } from '@/lib/tanstack-table/customFilterFn';
import React from 'react';

interface StatusUIProps {
  status: string;
}

const StatusUI: React.FC<StatusUIProps> = ({ status }) => {
  const statusInfo = statusMap.find((item) => item.status === status) || {
    label: 'Không xác định',
    color: 'bg-gray-500',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-xl py-1 text-xs text-white font-medium ${statusInfo.color}`}
    >
      <span>{statusInfo.label}</span>
    </div>
  );
};

export default StatusUI;
