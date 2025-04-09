import GoodRequestWarehouseTable from '@/components/custom-table/good-request/GoodRequestWarehouseTable';
import React from 'react';

const WarehouseGoodRequests = () => {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>Yêu cầu</div>
      <GoodRequestWarehouseTable />
    </div>
  );
};

export default WarehouseGoodRequests;
