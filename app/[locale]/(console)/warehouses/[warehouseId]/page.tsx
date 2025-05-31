'use client';

import { useUpdateWarehouse } from '@/hooks/queries/warehouseQueries';
import useFormData from '@/hooks/useFormData';
import { Warehouse } from '@/types/warehouse';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import CreatedByUI from '@/components/app/CreatedByUI';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { toast } from 'react-toastify';

const UpdateWarehouse: React.FC = () => {
  const router = useRouter();
  const warehouse = useCurrentWarehouse();

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
            router.refresh();
          },
          onError: () => {
            toast.error('Cập nhật thất bại. Vui lòng thử lại.');
          },
        }
      );
    }
  };

  if (!warehouse) {
    return (
      <div className='text-center mt-10 text-gray-600'>Không tìm thấy kho</div>
    );
  }

  return (
    <div className='min-h-[93.5vh] bg-gray-50 p-6 flex justify-center'>
      <div className='w-full max-w-5xl bg-white rounded-2xl shadow border border-gray-200 p-8 space-y-8 text-sm text-gray-700'>
        {/* Title */}
        <h2 className='text-2xl font-semibold text-gray-800 text-center'>
          {/* {`Thông tin kho hàng` warehouse.} */}
        </h2>

        <div className='flex flex-col lg:flex-row gap-10'>
          {/* Form Section */}
          <form onSubmit={onSubmit} className='flex-1 space-y-5'>
            {/* Tên kho */}
            <div>
              <label
                htmlFor='name'
                className='block mb-1 font-medium text-gray-600'
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
                className='w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label
                htmlFor='phone'
                className='block mb-1 font-medium text-gray-600'
              >
                Số điện thoại
              </label>
              <input
                id='phone'
                name='phone'
                type='text'
                value={formData.phone || ''}
                onChange={handleChange}
                className='w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
            </div>

            {/* Địa chỉ */}
            <div>
              <label
                htmlFor='address'
                className='block mb-1 font-medium text-gray-600'
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
                className='w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
            </div>

            {/* Diện tích */}
            <div>
              <label
                htmlFor='area'
                className='block mb-1 font-medium text-gray-600'
              >
                Diện tích (m²)
              </label>
              <input
                id='area'
                name='area'
                type='number'
                value={formData.area || ''}
                onChange={handleChange}
                className='w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
            </div>

            {/* Hoạt động từ */}
            <div>
              <label
                htmlFor='operateFrom'
                className='block mb-1 font-medium text-gray-600'
              >
                Hoạt động từ
              </label>
              <input
                id='operateFrom'
                name='operateFrom'
                type='date'
                value={(formData.operateFrom || '').split('T')[0]}
                onChange={handleChange}
                className='w-full border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
            </div>

            {/* Submit button */}
            <div className='flex justify-end pt-4'>
              <button
                type='submit'
                disabled={isUpdating || !isFormChanged}
                className={`px-6 py-2 rounded-md font-medium text-white transition duration-200 ${
                  isUpdating || !isFormChanged
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </form>

          {/* Info Section */}
          <div className='w-full lg:w-1/3 bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-700'>
              Thông tin hiện tại
            </h3>

            <CreatedByUI
              fullName={warehouse.createdByFullName || 'Ware Ease'}
              group={warehouse.createdByGroup || 'Hệ thống'}
              avatarUrl={
                warehouse.createdByAvatarUrl || 'https://github.com/shadcn.png'
              }
            />

            <div className='text-sm text-gray-600 space-y-1'>
              <p>
                <strong>Tên kho:</strong> {warehouse.name}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {warehouse.address}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {warehouse.phone}
              </p>
              <p>
                <strong>Diện tích:</strong> {warehouse.area} m²
              </p>
              {/* <p>
                <strong>Tọa độ:</strong> ({warehouse.latitude},{' '}
                {warehouse.longitude})
              </p> */}
              <p>
                <strong>Hoạt động từ:</strong>{' '}
                {new Date(warehouse.operateFrom).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateWarehouse;
