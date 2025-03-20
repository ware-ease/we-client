'use client';
import { TranslatedMessage } from '@/app/_components/app/TranslatedMessage';
import React from 'react';
import { DataTable } from './DataTable';
import { columns } from './Columns';
import Loading from '@/app/_components/app/Loading';
import Error from '@/app/_components/app/Error';
import { useProducts } from '@/lib/hooks/queries/productQueries';

const Products = () => {
  const { data, isPending, isError } = useProducts();

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

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
