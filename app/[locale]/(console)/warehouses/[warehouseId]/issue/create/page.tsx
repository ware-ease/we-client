'use client';
import { Input } from '@/components/shadcn-base/Input';
import React, { useEffect, useState } from 'react';
import RequestComboBox from '@/components/combo-boxes/RequestComboBox';
import { Button } from '@/components/shadcn-base/Button';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { GoodNote } from '@/types/goodNote';
import useFormData from '@/hooks/useFormData';
import {
  useAddGoodInternalIssueNote,
  useAddGoodIssueNote,
} from '@/hooks/queries/goodNoteQueries';
import { usePathname, useRouter } from '@/lib/i18n/routing';
import {
  useGoodIssueRequests,
  useGoodTransferRequests,
} from '@/hooks/queries/goodRequests';
import { useQuery } from '@tanstack/react-query';
import { getGoodRequestById } from '@/services/goodRequestService';
import { useAuth } from '@/components/providers/AuthProvider';
import CustomIssueTable, {
  RowData,
} from '@/components/custom-table/CustomIssueTable';
import { mapGoodIssueDetails } from '@/lib/utils/mapGoodDetails';

const IssueCreate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const [initialData, setInitialData] = useState<RowData[]>([]);
  const [data, setData] = useState<RowData[]>([]);
  const [receiverName, setReceiverName] = useState<string>('');
  const { formData, handleChange, setFormData } = useFormData<GoodNote>({
    shipperName: '',
    receiverName: '',
    date: new Date().toISOString().split('T')[0],
    goodRequestId: '',
    goodNoteDetails: [],
    requestedWarehouseId: '',
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      shipperName:
        currentUser?.profile?.lastName +
          ' ' +
          currentUser?.profile?.firstName || '',
    }));
  }, [currentUser, setFormData]);

  const { data: requests } = useGoodIssueRequests();
  const { data: transferReqs } = useGoodTransferRequests();

  const { data: reqDetails } = useQuery({
    queryKey: ['requestDetails', formData.goodRequestId],
    queryFn: () => getGoodRequestById(formData.goodRequestId || ''),
    enabled: !!formData.goodRequestId,
  });

  const { mutate } = useAddGoodIssueNote();
  const { mutate: mutateInternal } = useAddGoodInternalIssueNote();

  const currentWarehouse = useCurrentWarehouse();

  const handleSubmit = () => {
    try {
      const finalFormData = {
        ...formData,
        goodNoteDetails: mapGoodIssueDetails(data),
        requestedWarehouseId: currentWarehouse?.id,
      };

      if (finalFormData.goodNoteDetails.length === 0) {
        return;
      }

      if (transferReqs?.find((r) => r.id === formData.goodRequestId)) {
        mutateInternal(finalFormData, {
          onSuccess: () => {
            router.push(pathname.replace('/create', ''));
          },
        });
      } else {
        mutate(finalFormData, {
          onSuccess: () => {
            router.push(pathname.replace('/create', ''));
          },
        });
      }
    } catch {}
  };

  useEffect(() => {
    if (reqDetails?.goodRequestDetails) {
      const tableData: RowData[] = reqDetails.goodRequestDetails.map(
        (detail, index) => ({
          id: `${index}`,
          sku: detail.productId || '',
          name: detail.productName || '',
          unit: detail.unitName || '',
          quantity: detail.quantity ? detail.quantity : 0,
          batch: '',
          note: '',
          productId: detail.productId || '',
          batchId: '',
          mfgDate: '',
          expDate: '',
          unitType: detail.unitType || 0,
        })
      );
      setInitialData(tableData);
    }
  }, [reqDetails]);

  const handleRequestSelect = (value: string) => {
    const req = requests
      ?.concat(transferReqs || [])
      .find((req) => req.id === value);

    setFormData((prevData) => ({
      ...prevData,
      goodRequestId: req?.id ?? '',
    }));
    setReceiverName(req?.partner?.name || req?.warehouse?.name || '');
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl bg-white rounded-xl shadow-lg p-6'>
        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold text-gray-800 mb-6'>
            Phiếu xuất kho
          </h1>
          {/* Yêu cầu từ */}
          <div>
            <label
              htmlFor='goodRequestId'
              className='block text-sm font-medium text-gray-700'
            >
              Yêu cầu từ
            </label>
            <div className='mt-1'>
              <RequestComboBox
                value={formData.goodRequestId ?? ''}
                requests={requests?.concat(transferReqs || [])}
                onChange={(value) => handleRequestSelect(value)}
              />
            </div>
          </div>
        </div>
        <div className='space-y-4'>
          {/* General Info Section */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Mã phiếu */}
            <div>
              <label
                htmlFor='code'
                className='block text-sm font-medium text-gray-700'
              >
                Mã phiếu
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
            {/* Ngày tạo */}
            <div>
              <label
                htmlFor='date'
                className='block text-sm font-medium text-gray-700'
              >
                Ngày tạo
              </label>
              <Input
                id='date'
                name='date'
                defaultValue={formData.date}
                type='date'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
            {/* Khách hàng */}
            <div>
              <label
                htmlFor='receiverNameCustomer'
                className='block text-sm font-medium text-gray-700'
              >
                Khách hàng
              </label>
              <Input
                id='receiverNameCustomer'
                value={receiverName}
                disabled
                className='mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed'
              />
            </div>
            {/* Người giao hàng */}
            <div>
              <label
                htmlFor='shipperName'
                className='block text-sm font-medium text-gray-700'
              >
                Người giao hàng
              </label>
              <Input
                id='shipperName'
                name='shipperName'
                value={formData.shipperName}
                disabled
                className='mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed'
              />
            </div>
            {/* Kho xuất */}
            <div>
              <label
                htmlFor='warehouse'
                className='block text-sm font-medium text-gray-700'
              >
                Kho xuất
              </label>
              <Input
                id='warehouse'
                value={currentWarehouse?.name ?? ''}
                disabled
                className='mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed'
              />
            </div>
            {/* Người nhận hàng */}
            <div>
              <label
                htmlFor='receiverName'
                className='block text-sm font-medium text-gray-700'
              >
                Người nhận hàng
              </label>
              <Input
                id='receiverName'
                name='receiverName'
                value={formData.receiverName}
                onChange={handleChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>

          {/* Table Section */}
          <div>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              Chi tiết xuất kho
            </h2>
            {currentWarehouse && (
              <CustomIssueTable
                warehouseId={currentWarehouse.id}
                initialData={initialData}
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
              Tạo phiếu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCreate;
