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
  };

  const handleWarehouseSelect = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      requestedWarehouseId: value,
    }));
  };

  return (
    <div className='flex flex-col w-full min-h-[calc(100vh-3rem)] p-6 bg-gray-50'>
      {/* Header */}
      <div className='flex mb-6 bg-white p-6 rounded-lg shadow-sm'>
        <h1 className='text-2xl font-bold text-gray-800'>Tạo yêu cầu</h1>
      </div>

      {/* Form Fields */}
      <div className='bg-white p-6 rounded-lg shadow-sm mb-6'>
        <div className='grid grid-cols-3 gap-6'>
          {/* Column 1 */}
          <div className='flex flex-col space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Mã yêu cầu
              </label>
              <Input
                name='code'
                value={'Hệ thống tự tạo'}
                onChange={handleChange}
                className='w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                disabled
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className='flex flex-col space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Loại yêu cầu
              </label>
              <Input
                name='requestType'
                value={'Chuyển'}
                onChange={handleChange}
                className='w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                disabled
              />
            </div>
            {currentWarehouse && (
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {'Kho yêu cầu'}
                </label>
                <Input
                  name='requestType'
                  value={currentWarehouse?.name}
                  onChange={handleChange}
                  className='w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                  disabled
                />
              </div>
            )}
          </div>

          {/* Column 3 */}
          <div className='flex flex-col space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kho chuyển
              </label>
              <WarehouseComboBox
                value={formData.requestedWarehouseId ?? ''}
                onChange={(value) => handleWarehouseSelect(value)}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Diễn giải
              </label>
              <Input
                name='note'
                value={formData.note}
                onChange={handleChange}
                className='w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white p-6 rounded-lg shadow-sm mb-6'>
        {formData.requestedWarehouseId && (
          <CustomRequestTable
            warehouseId={formData.requestedWarehouseId}
            isRequestDetails
            onDataChange={setData}
          />
        )}
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <Button
          onClick={handleSubmit}
          className='bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md'
        >
          Tạo yêu cầu
        </Button>
      </div>
    </div>
  );
};

export default WarehouseRequestCreate;
