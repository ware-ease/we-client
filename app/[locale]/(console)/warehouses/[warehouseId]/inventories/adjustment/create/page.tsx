'use client';
import CustomInventoryAdjustmentTable, {
  AdjustmentRowData,
} from '@/components/custom-table/CustomInventoryAdjustmentTable';
import { Input } from '@/components/shadcn-base/Input';
import { useAddInventoryAdjustments } from '@/hooks/queries/inventoryAdjustmentQueries';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import useFormData from '@/hooks/useFormData';
import { usePathname, useRouter } from '@/lib/i18n/routing';
import { InventoryAdjustment } from '@/types/warehouse';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const InventoryAdjustmentCreate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<AdjustmentRowData[]>([]);
  const { formData, handleChange } = useFormData<InventoryAdjustment>({
    date: new Date().toISOString().split('T')[0],
    reason: '',
    type: 0,
    relatedDocument: '',
    note: '',
    warehouseId: '',
    inventoryAdjustmentDetails: [],
  });
  const currentWarehouse = useCurrentWarehouse();

  const { mutate } = useAddInventoryAdjustments();

  const handleSubmit = () => {
    console.log(data);
    const finalFormData = {
      ...formData,
      warehouseId: currentWarehouse?.id,
      inventoryAdjustmentDetails: data.map((row) => {
        return {
          changeInQuantity: row.changeInQuantity,
          note: row.note,
          inventoryId: row.id,
        };
      }),
    };

    if (finalFormData.reason?.trim() === '') {
      toast.error('Vui lòng điền lý do!');
      return;
    }

    if (finalFormData.inventoryAdjustmentDetails.length <= 0) {
      toast.error('Vui lòng thêm tồn kho cần điều chỉnh!');
      return;
    }

    console.log(finalFormData);
    mutate(finalFormData, {
      onSuccess: () => {
        router.push(pathname.replace('/create', ''));
      },
    });
  };

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
                name='date'
                value={formData.date}
                onChange={handleChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
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
                name='reason'
                value={formData.reason}
                onChange={handleChange}
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
                name='type'
                value={formData.type}
                onChange={handleChange}
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
                name='relatedDocument'
                value={formData.relatedDocument}
                onChange={handleChange}
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
                name='note'
                value={formData.note}
                onChange={handleChange}
                placeholder='Điền ghi chú...'
                className='mt-1 w-full text-sm p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24'
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
                  name='warehouseId'
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
              onClick={handleSubmit}
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
