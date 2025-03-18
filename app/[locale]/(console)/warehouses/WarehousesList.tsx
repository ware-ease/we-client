'use client';
import { Button } from '@/app/_components/shadcn-base/Button';
import { Input } from '@/app/_components/shadcn-base/Input';
import { TranslatedMessage } from '@/app/_components/app/TranslatedMessage';
import React from 'react';
import WarehouseCard from './WarehouseCard';
import AddWarehouseDialog from '@/app/_components/dialogs/AddWarehouseDialog';
import { useQuery } from '@tanstack/react-query';
import { getAllWarehouses } from '@/lib/services/warehouseService';
import { usePathname } from '@/i18n/routing';

const WarehousesList = () => {
  const pathname = usePathname();

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: getAllWarehouses,
  });

  return (
    <div className='flex flex-col rounded-md border w-full'>
      <div className='flex p-5 border-b-[1px] w-full justify-between'>
        <div className='flex w-[50%]'>
          <Input className='w-1/3 mr-4' />
          <Button className='w-[16%]'>
            <TranslatedMessage tKey='Management.filter' />
          </Button>
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
            area='2000m2'
            name={warehouse.name}
            operatedFrom='15/3/2025'
          />
        ))}
      </div>
    </div>
  );
};

export default WarehousesList;
