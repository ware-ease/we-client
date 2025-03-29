import React from 'react';

interface StatusUIProps {
  status: string;
}

const StatusUI: React.FC<StatusUIProps> = ({ status }) => {
  const statusMap = [
    { status: 'Pending', label: 'Chờ xử lý', color: 'bg-yellow-500' },
    { status: 'Completed', label: 'Hoàn thành', color: 'bg-green-500' },
    { status: 'Canceled', label: 'Đã hủy', color: 'bg-red-500' },
    { status: 'Failed', label: 'Thất bại', color: 'bg-orange-500' },
  ];

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
