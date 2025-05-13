'use client';
import { Input } from '@/components/shadcn-base/Input';
import React, { useState } from 'react';
import { Button } from '@/components/shadcn-base/Button';
import { RowData } from '@/components/custom-table/CustomTable';
import WarehouseComboBox from '@/components/combo-boxes/WarehouseComboBox';
import useFormData from '@/hooks/useFormData';
import { GoodRequest } from '@/types/goodRequest';
import { useAddGoodRequest } from '@/hooks/queries/goodRequests';
import { usePathname, useRouter } from '@/lib/i18n/routing';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { mapGoodRequestDetails } from '@/lib/utils/mapGoodDetails';
import CustomRequestTable from '@/components/custom-table/CustomRequestTable';

const WarehouseRequestCreate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentWarehouse = useCurrentWarehouse();
  const [data, setData] = useState<RowData[]>([]);
  const { formData, handleChange, setFormData } = useFormData<GoodRequest>({
    requestType: 2,
    partnerName: '',
    code: '',
    note: '',
    partnerId: '',
    warehouseId: '',
    requestedWarehouseId: '',
    goodRequestDetails: [],
  });

  const { mutate } = useAddGoodRequest();

  const handleSubmit = () => {
    try {
      const finalFormData = {
        ...formData,
        goodRequestDetails: mapGoodRequestDetails(data),
        warehouseId: currentWarehouse?.id,
        requestType: 2,
      };

      if (finalFormData.goodRequestDetails.length === 0) {
        return;
      }

      mutate(finalFormData, {
        onSuccess: () => {
          router.push(pathname.replace('/create', ''));
        },
      });
    } catch {}
  };

  const handleWarehouseSelect = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      requestedWarehouseId: value,
    }));
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl bg-white rounded-xl shadow-lg p-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>
          Tạo yêu cầu chuyển kho
        </h1>
        <div className='space-y-4'>
          {/* General Info Section */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Mã yêu cầu */}
            <div>
              <label
                htmlFor='code'
                className='block text-sm font-medium text-gray-700'
              >
                Mã yêu cầu
              </label>
              <Input
                id='code'
                name='code'
                value='Hệ thống tự tạo'
                disabled
                onChange={handleChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed'
              />
            </div>
            {/* Loại yêu cầu */}
            <div>
              <label
                htmlFor='requestType'
                className='block text-sm font-medium text-gray-700'
              >
                Loại yêu cầu
              </label>
              <Input
                id='requestType'
                name='requestType'
                value='Chuyển'
                disabled
                onChange={handleChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed'
              />
            </div>
            {/* Kho yêu cầu */}
            {currentWarehouse && (
              <div>
                <label
                  htmlFor='requestingWarehouse'
                  className='block text-sm font-medium text-gray-700'
                >
                  Kho yêu cầu
                </label>
                <Input
                  id='requestingWarehouse'
                  name='requestingWarehouse'
                  value={currentWarehouse?.name}
                  disabled
                  onChange={handleChange}
                  className='mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed'
                />
              </div>
            )}
            {/* Kho chuyển */}
            <div>
              <label
                htmlFor='requestedWarehouseId'
                className='block text-sm font-medium text-gray-700'
              >
                Kho chuyển
              </label>
              <div className='mt-1'>
                <WarehouseComboBox
                  value={formData.requestedWarehouseId ?? ''}
                  onChange={(value) => handleWarehouseSelect(value)}
                />
              </div>
            </div>
            {/* Diễn giải */}
            <div>
              <label
                htmlFor='note'
                className='block text-sm font-medium text-gray-700'
              >
                Diễn giải
              </label>
              <Input
                id='note'
                name='note'
                value={formData.note}
                onChange={handleChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
          </div>

          {/* Table Section */}
          <div>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              Chi tiết yêu cầu
            </h2>
            {formData.requestedWarehouseId && (
              <CustomRequestTable
                warehouseId={formData.requestedWarehouseId}
                isRequestDetails
                onDataChange={setData}
              />
            )}
          </div>

          {/* Form Actions */}
          <div className='flex justify-end space-x-4'>
            <Button
              onClick={handleSubmit}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            >
              Tạo yêu cầu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseRequestCreate;
