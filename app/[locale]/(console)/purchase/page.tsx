'use client';

import { TranslatedMessage } from '@/components/app/TranslatedMessage';
import { Purchase } from '@/types/purchase';
import { columns } from './Columns';
import { DataTable } from './DataTable';

const Purchases = () => {
  const data: Purchase[] = [];

  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-6'>
          <div className='text-4xl font-semibold text-primary'>
            <TranslatedMessage tKey='Purchases.title' />
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Purchases;
