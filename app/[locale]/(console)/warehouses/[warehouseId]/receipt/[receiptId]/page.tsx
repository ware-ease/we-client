'use client';
import { Input } from '@/components/shadcn-base/Input';
import React, { useEffect, useState } from 'react';
import RequestComboBox from '../../../../../../../components/combo-boxes/RequestComboBox';
import { Button } from '@/components/shadcn-base/Button';
import CustomTable, { RowData } from '@/components/custom-table/CustomTable';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { useQuery } from '@tanstack/react-query';
import { getAllGoodReceiveRequests } from '@/services/goodRequestService';
import { GoodNote } from '@/types/goodNote';
import useFormData from '@/hooks/useFormData';
import {
  useGoodReceiveNote,
  useUpdateGoodReceiveNote,
} from '@/hooks/queries/goodNoteQueries';
import { toast } from 'react-toastify';
import { usePathname } from '@/lib/i18n/routing';
import { mapGoodNoteDetails } from '@/lib/utils/mapGoodDetails';

const ReceiptDetail = () => {
  const pathname = usePathname();
  const receiveNoteId = pathname.split('/')[4];
  const [data, setData] = useState<RowData[]>([]);
  const [supplierName, setSupplierName] = useState<string>('');
  const { formData, handleChange, setFormData } = useFormData<GoodNote>({
    noteType: 0,
    shipperName: '',
    receiverName: '',
    code: '',
    date: '',
    goodRequestId: '',
    goodNoteDetails: [],
  });

  const { data: requests } = useQuery({
    queryKey: ['requests'],
    queryFn: getAllGoodReceiveRequests,
  });

  const { data: receiveNote } = useGoodReceiveNote(true, receiveNoteId);

  useEffect(() => {
    if (receiveNote) {
      setFormData(receiveNote);
      setSupplierName(
        requests?.find((r) => r.id === receiveNote.goodRequestId)
          ?.partnerName || ''
      );
    }
  }, [receiveNote, requests, setFormData]);

  const initialData: RowData[] | undefined = receiveNote?.goodNoteDetails?.map(
    (detail) => ({
      id: detail.id || '',
      sku: detail.batch?.product?.sku || '',
      productId: detail.batch?.productId || '',
      name: detail.batch?.product?.name || '',
      unit: detail.batch?.product?.unitName || '',
      quantity: detail.quantity || 0,
      batch: detail.batch?.code || '',
      batchId: detail.batchId || '',
      note: detail.note || '',
      mfgDate: '',
      expDate: '',
      unitType: 0,
    })
  );

  const { mutate } = useUpdateGoodReceiveNote();

  const currentWarehouse = useCurrentWarehouse();

  const handleSubmit = () => {
    const finalFormData = {
      ...formData,
      goodNoteDetails: mapGoodNoteDetails(data),
    };

    if (finalFormData.goodNoteDetails.length === 0) {
      return;
    }

    if (finalFormData.shipperName?.trim() === '') {
      toast.error('Vui lòng điền tên người giao hàng');
      return;
    }

    mutate(finalFormData);
    // resetForm();
  };

  const handleRequestSelect = (value: string) => {
    const req = requests?.find((req) => req.id === value);

    setFormData((prevData) => ({
      ...prevData,
      goodRequestId: req?.id ?? '',
    }));
    setSupplierName(req?.partnerName ?? '');
  };

  return (
    <div className='flex flex-col w-full min-h-[calc(100vh-3rem)] p-4'>
      <div className='flex flex-col w-full'>
        <div className='flex space-x-20 items-center w-full'>
          <div className='text-4xl font-semibold text-primary'>
            Phiếu nhập kho
          </div>
          <div className='flex items-center space-x-2 text-sm'>
            <div className='text-md'>Yêu cầu từ:</div>
            <RequestComboBox
              value={formData.goodRequestId ?? ''}
              requests={requests}
              onChange={(value) => handleRequestSelect(value)}
            />
          </div>
        </div>
        <div className='flex space-x-20 py-5 pl-3'>
          <div className='flex flex-col space-y-2'>
            <div className='w-64'>
              <div className='text-sm'>Mã phiếu</div>
              <Input
                name='code'
                value={formData.code}
                onChange={handleChange}
                required
              />
            </div>
            <div className='w-64'>
              <div className='text-sm'>Ngày tạo</div>
              <Input
                name='date'
                value={formData.date?.substring(0, 10)}
                type='date'
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className='flex flex-col space-y-2'>
            <div className='w-64'>
              <div className='text-sm'>Nhà cung cấp</div>
              <Input value={supplierName} disabled />
            </div>
            <div className='w-64'>
              <div className='text-sm'>Người giao hàng</div>
              <Input
                name='shipperName'
                value={formData.shipperName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className='flex flex-col space-y-2'>
            <div className='w-64'>
              <div className='text-sm'>Kho nhập</div>
              <Input value={currentWarehouse?.name ?? ''} disabled />
            </div>
            <div className='w-64'>
              <div className='text-sm'>Người nhận hàng</div>
              <Input
                name='receiverName'
                value={formData.receiverName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
      </div>
      <div className=''>
        {initialData && (
          <CustomTable initialData={initialData} onDataChange={setData} />
        )}
      </div>
      <div className='flex w-full'>
        <div className='grow'></div>
        <Button onClick={handleSubmit}>Sửa phiếu</Button>
      </div>
    </div>
  );
};

export default ReceiptDetail;
