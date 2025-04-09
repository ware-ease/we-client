'use client';

import { useUpdateWarehouse } from '@/hooks/queries/warehouseQueries';
import useFormData from '@/hooks/useFormData';
import { Warehouse } from '@/types/warehouse';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { toast } from 'react-toastify';
const UpdateWarehouse: React.FC = () => {
  const router = useRouter();
  const warehouse = useCurrentWarehouse(); // warehouse: Warehouse | undefined

  const { mutate: updateWarehouse, isPending: isUpdating } =
    useUpdateWarehouse();

  const { formData, handleChange, setFormData } = useFormData<
    Partial<Warehouse>
  >({});
  const isFormChanged = JSON.stringify(formData) !== JSON.stringify(warehouse);

  useEffect(() => {
    if (warehouse) {
      setFormData(warehouse);
    }
  }, [warehouse, setFormData]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (warehouse?.id) {
      updateWarehouse(
        { id: warehouse.id, data: formData },
        {
          onSuccess: () => {
            toast.success('Cập nhật kho thành công!');
            router.refresh();
            //router.push('/warehouses');
          },
          onError: () => {
            toast.error('Cập nhật thất bại. Vui lòng thử lại.');
          },
        }
      );
    }
  };

  if (!warehouse)
    return (
      <div className='text-center mt-10 text-gray-600'>Không tìm thấy kho</div>
    );
  return (
    <div className='min-h-[93.5vh] bg-gray-100 flex items-center justify-center p-6'>
      {/* <div className='bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8'> */}
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full flex justify-center'>
        {/* Left: Form */}
        <div className='w-full md:w-3/4 lg:w-2/3'>
          <h2 className='text-2xl font-bold mb-6 text-gray-800 text-center'>
            Thông tin kho
          </h2>

          <form onSubmit={onSubmit} className='space-y-5'>
            {/* Name */}
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Tên kho
              </label>
              <input
                id='name'
                name='name'
                type='text'
                value={formData.name || ''}
                onChange={handleChange}
                required
                placeholder='Nhập tên kho'
                className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                    focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Số điện thoại
              </label>
              <input
                id='phone'
                name='phone'
                type='text'
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder='Nhập số điện thoại'
                className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                    focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor='address'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Địa chỉ
              </label>
              <input
                id='address'
                name='address'
                type='text'
                value={formData.address || ''}
                onChange={handleChange}
                required
                placeholder='Nhập địa chỉ kho'
                className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                    focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
            </div>

            {/* Area */}
            <div>
              <label
                htmlFor='area'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Diện tích (m²)
              </label>
              <input
                id='area'
                name='area'
                type='number'
                value={formData.area || ''}
                onChange={handleChange}
                placeholder='Nhập diện tích'
                className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                    focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
            </div>

            {/* Operate From */}
            <div>
              <label
                htmlFor='operateFrom'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Hoạt động từ
              </label>
              <input
                id='operateFrom'
                name='operateFrom'
                type='datetime-local'
                value={
                  formData.operateFrom
                    ? new Date(formData.operateFrom).toISOString().slice(0, 16)
                    : ''
                }
                onChange={handleChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                    focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
            </div>

            {/* Buttons */}
            <div className='flex justify-end gap-4 pt-4'>
              <button
                type='submit'
                disabled={isUpdating || !isFormChanged}
                className={`px-4 py-2 rounded-md transition duration-150 ease-in-out 
                ${
                  isUpdating || !isFormChanged
                    ? 'bg-indigo-400 text-white cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'
                }`}
              >
                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Placeholder image area (but not displaying image) */}
        {/* <div className='border border-dashed border-gray-300 rounded-md flex items-center justify-center'>
          <span className='text-gray-400 italic'> Vị trí (không hiển thị)</span>
        </div> */}
      </div>
    </div>
  );
};

export default UpdateWarehouse;
