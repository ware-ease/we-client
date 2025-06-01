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
import RequestTypeComboBox from '@/components/combo-boxes/RequestTypeComboBox';
import PartnerComboBox from '@/components/combo-boxes/PartnerComboBox';
import { mapGoodRequestDetails } from '@/lib/utils/mapGoodDetails';
import CustomRequestTable from '@/components/custom-table/CustomRequestTable';
import CustomReceiptRequestTable from '@/components/custom-table/CustomReceiptRequestTable';

const RequestCreate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<RowData[]>([]);
  const { formData, handleChange, setFormData } = useFormData<GoodRequest>({
    requestType: 0,
    partnerName: '',
    code: '',
    note: '',
    partnerId: '',
    warehouseId: '',
    requestedWarehouseId: '',
    goodRequestDetails: [],
  });

  const { mutate, isPending } = useAddGoodRequest();

  const handleSubmit = () => {
    try {
      const finalFormData = {
        ...formData,
        goodRequestDetails: mapGoodRequestDetails(data),
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

  const handlePartnerSelect = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      partnerId: value,
    }));
  };

  const handleWarehouseSelect = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      requestedWarehouseId: value,
    }));
  };

  const handleRequestTypeSelect = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      requestType: parseInt(value),
    }));
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl bg-white rounded-xl shadow-lg p-6'>
        <h1 className='text-2xl font-bold text-gray-800 mb-6'>Tạo yêu cầu</h1>
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
              <div className='mt-1'>
                <RequestTypeComboBox
                  value={formData.requestType?.toString() ?? ''}
                  onChange={(value) => handleRequestTypeSelect(value)}
                />
              </div>
            </div>
            {/* Nhà cung cấp / Khách hàng */}
            {formData.requestType !== 2 && (
              <div>
                <label
                  htmlFor='partnerId'
                  className='block text-sm font-medium text-gray-700'
                >
                  {formData.requestType === 0 ? 'Nhà cung cấp' : 'Khách hàng'}
                </label>
                <div className='mt-1'>
                  <PartnerComboBox
                    value={formData.partnerId ?? ''}
                    onChange={(value) => handlePartnerSelect(value)}
                    partnerType={formData.requestType === 0 ? 0 : 1}
                  />
                </div>
              </div>
            )}
            {/* Kho nhận yêu cầu */}
            <div>
              <label
                htmlFor='requestedWarehouseId'
                className='block text-sm font-medium text-gray-700'
              >
                Kho nhận yêu cầu
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
            {formData.requestType === 1 && formData.requestedWarehouseId ? (
              <CustomRequestTable
                warehouseId={formData.requestedWarehouseId}
                isRequestDetails
                onDataChange={setData}
              />
            ) : (
              <CustomReceiptRequestTable
                isRequestDetails
                onDataChange={setData}
              />
            )}
          </div>

          {/* Form Actions */}
          <div className='flex justify-end space-x-4'>
            <Button
              onClick={handleSubmit}
              disabled={
                formData.partnerId === '' ||
                formData.requestedWarehouseId === '' ||
                isPending
              }
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

export default RequestCreate;
