'use client';
import { TranslatedMessage } from '@/app/_components/app/TranslatedMessage';
import React from 'react';
import { DataTable } from './DataTable';
import { columns } from './Columns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllProducts } from '@/lib/services/productService';
import { toast } from 'react-toastify';

const Products = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  });

  if (isLoading) {
    return <p className='text-center text-gray-500'>Loading...</p>;
  }

  if (isError) {
    toast.error('Failed to fetch products.');
    return <p className='text-center text-red-500'>Error loading accounts.</p>;
  }

  const handleProductAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-6'>
          <div className='text-4xl font-semibold text-primary'>
            <TranslatedMessage tKey='Products.title' />
          </div>
          <div></div>
        </div>
        <DataTable
          columns={columns}
          data={data!}
          onProductAdded={handleProductAdded}
        />
      </div>
    </div>
  );
};

export default Products;
