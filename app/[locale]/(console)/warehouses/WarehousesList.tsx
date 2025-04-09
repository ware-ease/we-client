'use client';
import { Input } from '@/components/shadcn-base/Input';
import React from 'react';
import WarehouseCard from './WarehouseCard';
import AddWarehouseDialog from '@/components/dialogs/AddWarehouseDialog';
import { usePathname } from '@/lib/i18n/routing';
import { useWarehouses } from '@/hooks/queries/warehouseQueries';

const WarehousesList = () => {
  const pathname = usePathname();

  const { data: warehouses } = useWarehouses();

  return (
    <div className='flex flex-col rounded-md border w-full'>
      <div className='flex p-5 border-b-[1px] w-full justify-between'>
        <div className='flex w-[50%]'>
          <Input className='w-1/2 mr-4' placeholder='Tìm kho theo tên...' />
        </div>
        <div className='flex w-[50%] justify-end'>
          <AddWarehouseDialog />
        </div>
      </div>
      <div className='flex flex-col p-4 gap-2 overflow-auto max-h-[65vh]'>
        {warehouses?.map((warehouse, index) => (
          <WarehouseCard
            key={index}
            idPath={`${pathname}/${warehouse.id}`}
            address={warehouse.address}
            area={`${warehouse.area.toString()}m²`}
            name={warehouse.name}
            operatedFrom={`${new Date(
              warehouse.operateFrom ?? ''
            ).toLocaleDateString('vi-VN')}`}
            phone={warehouse.phone || ''}
          />
        ))}
      </div>
    </div>
  );
};

export default WarehousesList;
