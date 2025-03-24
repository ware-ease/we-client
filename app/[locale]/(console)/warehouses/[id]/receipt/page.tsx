import React from 'react';
import GoodReceiveNoteTable from '@/components/custom-table/good-note/GoodReceiveNoteTable';

const WarehouseReceipt = () => {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>Phiếu nhập kho</div>
      <GoodReceiveNoteTable />
    </div>
  );
};

export default WarehouseReceipt;
