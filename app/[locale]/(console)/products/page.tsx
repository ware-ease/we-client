import React from 'react';
import ProductTable from '@/components/custom-table/product/ProductTable';

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
