'use client';
import { TranslatedMessage } from '@/app/_components/TranslatedMessage';
import React from 'react';
import { DataTable } from './DataTable';
import { columns } from './Columns';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '@/lib/services/productService';
import { toast } from 'react-toastify';

const Products = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAllProducts,
  });

  if (isLoading) {
    return <p className='text-center text-gray-500'>Loading...</p>;
  }

  if (isError) {
    toast.error('Failed to fetch products.');
    return <p className='text-center text-red-500'>Error loading accounts.</p>;
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
        <DataTable columns={columns} data={data!} />
      </div>
    </div>
  );
};

export default Products;
