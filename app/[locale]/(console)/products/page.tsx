import { TranslatedMessage } from '@/app/_components/TranslatedMessage';
import React from 'react';
import { DataTable } from './DataTable';
import { columns } from './Columns';
import { Product } from '@/lib/types/product';

const Products = () => {
  const data: Product[] = [];

  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-6'>
          <div className='text-4xl font-semibold text-primary'>
            <TranslatedMessage tKey='Products.title' />
          </div>
          <div></div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Products;
