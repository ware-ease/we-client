'use client';
import { Input } from '@/components/shadcn-base/Input';
import React, { useState } from 'react';
import RequestComboBox from '../../../../../../../components/combo-boxes/RequestComboBox';
import { Button } from '@/components/shadcn-base/Button';
import CustomTable, { RowData } from '@/components/custom-table/CustomTable';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { useQuery } from '@tanstack/react-query';
import { getAllGoodReceiveRequests } from '@/services/goodRequestService';
import { GoodNote } from '@/types/goodNote';
import useFormData from '@/hooks/useFormData';
import { useAddGoodReceiveNote } from '@/hooks/queries/goodNoteQueries';
import { toast } from 'react-toastify';
import { GoodNoteSchema } from '@/lib/zod/schemas';
import { usePathname, useRouter } from '@/lib/i18n/routing';

const ReceiptCreate = () => {
  const router = useRouter();
  const pathname = usePathname();
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

  const { mutate } = useAddGoodReceiveNote();

  const currentWarehouse = useCurrentWarehouse();

  const handleSubmit = () => {
    const finalFormData = {
      ...formData,
      goodNoteDetails: data.map((row) => ({
        quantity: parseFloat(row.quantity.toString()),
        note: row.note,
        batchId: row.batch,
      })),
    };

    console.log(data);

    console.log(finalFormData);

    const result = GoodNoteSchema.safeParse(finalFormData);

    if (!result.success) {
      result.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }

    mutate(finalFormData, {
      onSuccess: () => {
        router.push(pathname.replace('/create', ''));
      },
    });
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
                value={formData.date}
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
        <CustomTable onDataChange={setData} />
      </div>
      <div className='flex w-full'>
        <div className='grow'></div>
        <Button onClick={handleSubmit}>Tạo phiếu</Button>
      </div>
    </div>
  );
};

export default ReceiptCreate;
