'use client';
import React from 'react';
import InventoryTable from '@/components/custom-table/inventory/InventoryTable';

const WarehouseGoods = () => {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>
        Hàng hóa trong kho
      </div>
      <InventoryTable onlyCurrentWarehouse />
    </div>
  );
};

export default WarehouseGoods;
