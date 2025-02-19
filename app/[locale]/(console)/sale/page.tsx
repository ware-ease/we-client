'use client';

import { TranslatedMessage } from '@/app/_components/TranslatedMessage';
import { Sale } from '@/lib/types/sale';
import { columns } from './Columns';
import { DataTable } from './DataTable';

const Sales = () => {
  const data: Sale[] = [];

  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-6'>
          <div className='text-4xl font-semibold text-primary'>
            <TranslatedMessage tKey='Sales.title' />
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Sales;
