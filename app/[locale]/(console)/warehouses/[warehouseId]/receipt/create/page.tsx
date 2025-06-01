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
import { GoodNote, GoodReceiveNote } from '@/types/goodNote';
import useFormData from '@/hooks/useFormData';
import {
  useAddGoodInternalReceiptNote,
  useAddGoodReceiveNote,
  useGoodIssueNotes,
} from '@/hooks/queries/goodNoteQueries';
import { usePathname, useRouter } from '@/lib/i18n/routing';
import { useAuth } from '@/components/providers/AuthProvider';
import { useGoodTransferRequests } from '@/hooks/queries/goodRequests';
import { mapGoodNoteDetails } from '@/lib/utils/mapGoodDetails';
import { toast } from 'react-toastify';
import CustomReceiveTransferTable from '@/components/custom-table/CustomReceiveTransferTable';
import GoodNoteComboBox from '@/components/combo-boxes/GoodNoteComboBox';

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
  const [isTransfer, setIsTransfer] = useState<boolean>(false);
  const [selectedGoodNote, setSelectedGoodNote] = useState<GoodNote>({});

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
  const { data: goodNotes } = useGoodIssueNotes(true);

  const { data: reqDetails } = useQuery({
    queryKey: ['requestDetails', formData.goodRequestId],
    queryFn: () => getGoodRequestById(formData.goodRequestId || ''),
    enabled: !!formData.goodRequestId,
  });

  const { mutate, isPending: isAddPending } = useAddGoodReceiveNote();
  const { mutate: mutateInternal, isPending } = useAddGoodInternalReceiptNote();

  const currentWarehouse = useCurrentWarehouse();

  const handleSubmit = () => {
    try {
      const finalFormData = {
        ...formData,
        goodNoteDetails: mapGoodNoteDetails(data),
        requestedWarehouseId: currentWarehouse?.id,
      };

      const transferFormData = {
        ...formData,
        goodNoteDetails:
          selectedGoodNote?.goodNoteDetails?.map((detail) => ({
            quantity: detail.quantity || 0,
            batchId: detail.batch?.id || '',
            note: detail.note || '',
          })) || [],
        requestedWarehouseId: currentWarehouse?.id,
      };

      if (!isTransfer && finalFormData.goodNoteDetails.length === 0) {
        return;
      }

      if (finalFormData.shipperName?.trim() === '') {
        toast.error('Vui lòng điền tên người giao hàng');
        return;
      }

      if (transferReqs?.find((r) => r.id === formData.goodRequestId)) {
        mutateInternal(transferFormData, {
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

  const handleRequestSelect = (value: string) => {
    const req = requests
      ?.concat(transferReqs || [])
      .find((req) => req.id === value);

    console.log(req);

    setFormData((prevData) => ({
      ...prevData,
      goodRequestId: req?.id ?? '',
    }));
    setSupplierName(req?.partner?.name ?? '');
    setIsTransfer(req?.code?.startsWith('YCC') || false);
  };

  const handleGoodNoteSelect = (value: string) => {
    const gn = goodNotes?.find((gn) => gn.id === value);

    setSelectedGoodNote(gn || {});
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
          unitType: detail.unitType || 0,
        })
      );
      setInitialData(tableData);
    }
  }, [reqDetails]);

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl bg-white rounded-xl shadow-lg p-6'>
        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold text-gray-800 mb-6'>
            Phiếu nhập kho
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
                requests={requests?.concat(
                  transferReqs?.filter((r) => r.status === 4) || []
                )}
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
            {/* Nhà cung cấp */}
            <div>
              <label
                htmlFor='supplierName'
                className='block text-sm font-medium text-gray-700'
              >
                Nhà cung cấp
              </label>
              <Input
                id='supplierName'
                value={supplierName}
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
                onChange={handleChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
                required
              />
            </div>
            {/* Kho nhập */}
            <div>
              <label
                htmlFor='warehouse'
                className='block text-sm font-medium text-gray-700'
              >
                Kho nhập
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
                disabled
                className='mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed'
              />
            </div>
          </div>

          {/* Table Section */}
          {isTransfer && (
            <div>
              <GoodNoteComboBox
                requestId={formData.goodRequestId || ''}
                value={selectedGoodNote.id || ''}
                onChange={(value) => handleGoodNoteSelect(value)}
              />
            </div>
          )}
          <div>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              Chi tiết nhập kho
            </h2>
            {isTransfer ? (
              <CustomReceiveTransferTable
                initialData={
                  selectedGoodNote?.goodNoteDetails?.map((detail, index) => ({
                    id: detail.id || `${index}`,
                    sku: detail.batch?.product?.sku || '',
                    name: detail.batch?.product?.name || '',
                    unit: detail.batch?.product?.unitName || '',
                    quantity: detail.quantity || 0,
                    batch: detail.batch?.code || '',
                    mfgDate: detail.batch?.mfgDate
                      ? new Date(detail.batch.mfgDate).toLocaleDateString(
                          'vi-VN'
                        )
                      : '',
                    expDate: detail.batch?.expDate
                      ? new Date(detail.batch.expDate).toLocaleDateString(
                          'vi-VN'
                        )
                      : '',
                    note: detail.note || '',
                    productId: detail.batch?.product?.id || undefined,
                    isBatchManaged:
                      detail.batch?.product?.isBatchManaged ?? false,
                    unitType: detail.batch?.product?.unitType ?? 0,
                  })) || []
                }
              />
            ) : (
              <CustomTable initialData={initialData} onDataChange={setData} />
            )}
          </div>

          {/* Form Actions */}
          <div className='flex justify-end space-x-4'>
            <Button
              onClick={handleSubmit}
              disabled={isPending || isAddPending}
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

export default ReceiptCreate;
