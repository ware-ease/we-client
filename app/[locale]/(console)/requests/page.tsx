import ProductTable from '@/app/_components/custom-table/product/ProductTable';
import React from 'react';

const Requests = () => {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>Tiêu đề</div>
      <ProductTable />
    </div>
  );
};

export default Requests;
