import { statusMap } from '@/lib/tanstack-table/customFilterFn';
import React from 'react';
import DeclineReasonDialog from '../dialogs/DeclineReasonDialog';

interface StatusUIProps {
  status: number;
  code: string;
  reason?: string;
}

const StatusUI: React.FC<StatusUIProps> = ({ status, code, reason }) => {
  const statusInfo = statusMap.find((item) => item.status === status) || {
    label: 'Đã hủy',
    color: 'bg-gray-500',
  };

  if (status !== 2) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl py-1 text-xs ${statusInfo.color} text-white font-medium`}
      >
        <span>{statusInfo.label}</span>
      </div>
    );
  } else {
    return <DeclineReasonDialog code={code} reason={reason || ''} />;
  }
};

export default StatusUI;
