import { Button } from '@/app/_components/shadcn-base/Button';
import { Input } from '@/app/_components/shadcn-base/Input';
import { TranslatedMessage } from '@/app/_components/TranslatedMessage';
import React from 'react';
import WarehouseCard from './WarehouseCard';
import AddWarehouseDialog from '@/app/_components/dialogs/AddWarehouseDialog';

const WarehousesList = () => {
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
        <WarehouseCard />
        <WarehouseCard />
        <WarehouseCard />
        <WarehouseCard />
        <WarehouseCard />
        <WarehouseCard />
        <WarehouseCard />
        <WarehouseCard />
        <WarehouseCard />
        <WarehouseCard />
      </div>
    </div>
  );
};

export default WarehousesList;
