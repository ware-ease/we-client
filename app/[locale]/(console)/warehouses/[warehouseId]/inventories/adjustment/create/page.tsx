'use client';
import CustomInventoryAdjustmentTable, {
  AdjustmentRowData,
} from '@/components/custom-table/CustomInventoryAdjustmentTable';
import { Input } from '@/components/shadcn-base/Input';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import React, { useState } from 'react';

const InventoryAdjustmentCreate: React.FC = () => {
  const [data, setData] = useState<AdjustmentRowData[]>([]);
  const currentWarehouse = useCurrentWarehouse();
  console.log(data);

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl bg-white rounded-xl shadow-lg p-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>
          Điều chỉnh tồn kho
        </h1>
        <div className='space-y-4'>
          {/* General Info Section */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Date */}
            <div>
              <label
                htmlFor='date'
                className='block text-sm font-medium text-gray-700'
              >
                Ngày điều chỉnh
              </label>
              <Input
                type='date'
                id='date'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            {/* Reason */}
            <div>
              <label
                htmlFor='reason'
                className='block text-sm font-medium text-gray-700'
              >
                Lý do
              </label>
              <Input
                type='text'
                id='reason'
                placeholder='VD: Hư hỏng, sai sót nhập liệu...'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            <div>
              <label
                htmlFor='documentType'
                className='block text-sm font-medium text-gray-700'
              >
                Loại chứng từ
              </label>
              <select
                id='documentType'
                className='flex h-9 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              >
                <option value='0'>Nhập/Xuất</option>
                <option value='1'>Kiểm kê</option>
              </select>
            </div>
            <div>
              <label
                htmlFor='relatedDocument'
                className='block text-sm font-medium text-gray-700'
              >
                Chứng từ liên quan (nếu có)
              </label>
              <Input
                type='text'
                id='relatedDocument'
                placeholder='Mã chứng từ'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            <div className=''>
              <label
                htmlFor='note'
                className='block text-sm font-medium text-gray-700'
              >
                Ghi chú
              </label>
              <textarea
                id='note'
                placeholder='Điền ghi chú...'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24'
              />
            </div>
            {currentWarehouse && (
              <div>
                <label
                  htmlFor='warehouseId'
                  className='block text-sm font-medium text-gray-700'
                >
                  Kho
                </label>
                <Input
                  id='warehouseId'
                  value={currentWarehouse.name}
                  readOnly
                  className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                ></Input>
              </div>
            )}
          </div>

          <div>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              Chọn tồn kho cần điều chỉnh
            </h2>
            <CustomInventoryAdjustmentTable onDataChange={setData} />
          </div>

          {/* Form Actions */}
          <div className='flex justify-end space-x-4'>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Tạo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAdjustmentCreate;
