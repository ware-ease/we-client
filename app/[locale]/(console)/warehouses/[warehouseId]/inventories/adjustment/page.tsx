import InventoryAdjustmentTable from '@/components/custom-table/inventory/InventoryAdjustmentTable';
import React from 'react';

const InventoryAdjustment = () => {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>
        Điều chỉnh tồn kho
      </div>
      <InventoryAdjustmentTable onlyCurrentWarehouse />
    </div>
  );
};

export default InventoryAdjustment;
