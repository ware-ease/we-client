import React from 'react';
import GoodIssueNoteTable from '@/components/custom-table/good-note/GoodIssueNoteTable';

const WarehouseIssue = () => {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>Phiếu xuất kho</div>
      <GoodIssueNoteTable onlyCurrentWarehouse />
    </div>
  );
};

export default WarehouseIssue;
