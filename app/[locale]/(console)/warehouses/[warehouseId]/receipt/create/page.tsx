'use client';
import { Input } from '@/components/shadcn-base/Input';
import React, { useEffect, useState } from 'react';
import RequestComboBox from '../../../../../../../components/combo-boxes/RequestComboBox';
import { Button } from '@/components/shadcn-base/Button';
import CustomTable, { RowData } from '@/components/custom-table/CustomTable';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { useQuery } from '@tanstack/react-query';
import {
  getAllGoodReceiveRequests,
  getGoodRequestById,
} from '@/services/goodRequestService';
import { GoodReceiveNote } from '@/types/goodNote';
import useFormData from '@/hooks/useFormData';
import {
  useAddGoodInternalReceiptNote,
  useAddGoodReceiveNote,
} from '@/hooks/queries/goodNoteQueries';
import { usePathname, useRouter } from '@/lib/i18n/routing';
import { useAuth } from '@/components/providers/AuthProvider';
import { useGoodTransferRequests } from '@/hooks/queries/goodRequests';

const ReceiptCreate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const [initialData, setInitialData] = useState<RowData[]>([]);
  const [data, setData] = useState<RowData[]>([]);
  const [supplierName, setSupplierName] = useState<string>('');
  const { formData, handleChange, setFormData } = useFormData<GoodReceiveNote>({
    shipperName: '',
    receiverName: '',
    date: new Date().toISOString().split('T')[0],
    goodRequestId: '',
    goodNoteDetails: [],
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      receiverName:
        currentUser?.profile?.lastName +
          ' ' +
          currentUser?.profile?.firstName || '',
    }));
  }, [currentUser, setFormData]);

  const { data: requests } = useQuery({
    queryKey: ['requests'],
    queryFn: getAllGoodReceiveRequests,
  });
  const { data: transferReqs } = useGoodTransferRequests();

  const { data: reqDetails } = useQuery({
    queryKey: ['requestDetails', formData.goodRequestId],
    queryFn: () => getGoodRequestById(formData.goodRequestId || ''),
    enabled: !!formData.goodRequestId,
  });

  const { mutate } = useAddGoodReceiveNote();
  const { mutate: mutateInternal } = useAddGoodInternalReceiptNote();

  const currentWarehouse = useCurrentWarehouse();

  const handleSubmit = () => {
    const finalFormData = {
      ...formData,
      goodNoteDetails: data.map((row) => ({
        quantity: parseFloat(row.quantity.toString()),
        note: row.note,
        newBatch: {
          productId: row.productId,
          name: 'Test',
          mfgDate: new Date(row.mfgDate),
          expDate: new Date(row.expDate),
        },
      })),
      requestedWarehouseId: currentWarehouse?.id,
    };

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
  };

  const handleRequestSelect = (value: string) => {
    const req = requests
      ?.concat(transferReqs || [])
      .find((req) => req.id === value);

    setFormData((prevData) => ({
      ...prevData,
      goodRequestId: req?.id ?? '',
    }));
    setSupplierName(req?.partner?.name ?? '');
  };

  useEffect(() => {
    if (reqDetails?.goodRequestDetails) {
      const tableData: RowData[] = reqDetails.goodRequestDetails.map(
        (detail, index) => ({
          id: `${index}`,
          sku: detail.productId || '',
          name: detail.productName || '',
          unit: '',
          quantity: detail.quantity ? detail.quantity : 0,
          batch: '',
          note: '',
          productId: detail.productId || '',
          batchId: '',
          mfgDate: '',
          expDate: '',
        })
      );
      setInitialData(tableData);
    }
  }, [reqDetails]);

  return (
    <div className='flex flex-col w-full min-h-[calc(100vh-3rem)] p-6 bg-gray-50'>
      {/* Header and Request ComboBox */}
      <div className='flex items-center justify-between mb-6 bg-white p-6 rounded-lg shadow-sm'>
        <h1 className='text-2xl font-bold text-gray-800'>Phiếu nhập kho</h1>
        <div className='flex items-center space-x-4'>
          <span className='text-sm text-gray-600 font-medium'>Yêu cầu từ:</span>
          <div className='w-64'>
            <RequestComboBox
              value={formData.goodRequestId ?? ''}
              requests={requests?.concat(
                transferReqs?.filter((r) => r.status === 4) || []
              )}
              onChange={(value) => handleRequestSelect(value)}
            />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className='bg-white p-6 rounded-lg shadow-sm mb-6'>
        <div className='grid grid-cols-3 gap-6'>
          {/* Column 1 */}
          <div className='flex flex-col space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Mã phiếu
              </label>
              <Input
                name='code'
                value={'Hệ thống tự tạo'}
                disabled
                onChange={handleChange}
                className='w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Ngày tạo
              </label>
              <Input
                name='date'
                defaultValue={formData.date}
                type='date'
                // onChange={handleChange}
                className='w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className='flex flex-col space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nhà cung cấp
              </label>
              <Input
                value={supplierName}
                disabled
                className='w-full border-gray-300 rounded-md bg-gray-100 cursor-not-allowed'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Người giao hàng
              </label>
              <Input
                name='shipperName'
                value={formData.shipperName}
                onChange={handleChange}
                className='w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
          </div>

          {/* Column 3 */}
          <div className='flex flex-col space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kho nhập
              </label>
              <Input
                value={currentWarehouse?.name ?? ''}
                disabled
                className='w-full border-gray-300 rounded-md bg-gray-100 cursor-not-allowed'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Người nhận hàng
              </label>
              <Input
                name='receiverName'
                value={formData.receiverName}
                disabled
                className='w-full border-gray-300 rounded-md bg-gray-100 cursor-not-allowed'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white p-6 rounded-lg shadow-sm mb-6'>
        <CustomTable initialData={initialData} onDataChange={setData} />
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <Button
          onClick={handleSubmit}
          className='bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md'
        >
          Tạo phiếu
        </Button>
      </div>
    </div>
  );
};

export default ReceiptCreate;
