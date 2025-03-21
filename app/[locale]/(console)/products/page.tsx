import React from 'react';
import ProductTable from '@/app/_components/custom-table/ProductTable';

const Products = () => {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>
        Quản lý sản phẩm
      </div>
      <ProductTable />
    </div>
  );
};

export default Products;
