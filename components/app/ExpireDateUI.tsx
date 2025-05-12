import React from 'react';

interface CreatedByUIProps {
  expDate: string;
}

const ExpireDateUI: React.FC<CreatedByUIProps> = ({ expDate }) => {
  const expInfo = {
    color:
      new Date(expDate) < new Date() &&
      new Date(expDate) > new Date('01/01/0001')
        ? 'bg-red-500'
        : new Date(expDate) > new Date('01/01/0001')
        ? 'bg-green-500'
        : 'bg-blue-500',
    text:
      new Date(expDate) < new Date() &&
      new Date(expDate) > new Date('01/01/0001')
        ? 'Đã quá hạn'
        : new Date(expDate) > new Date('01/01/0001')
        ? new Date(expDate).toLocaleDateString('vi-VN')
        : 'Không có HSD',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-xl py-1 text-xs ${expInfo.color} text-white font-medium max-w-40`}
    >
      {expInfo.text}
    </div>
  );
};

export default ExpireDateUI;
