import GoodRequestTable from '@/app/_components/custom-table/good-request/GoodRequestTable';
import React from 'react';

const Requests = () => {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>Yêu cầu</div>
      <GoodRequestTable />
    </div>
  );
};

export default Requests;
