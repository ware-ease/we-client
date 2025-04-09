'use client';
import { Input } from '@/components/shadcn-base/Input';
import React, { useEffect, useState } from 'react';
import RequestComboBox from '@/components/combo-boxes/RequestComboBox';
import { Button } from '@/components/shadcn-base/Button';
import CustomTable, { RowData } from '@/components/custom-table/CustomTable';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { GoodNote } from '@/types/goodNote';
import useFormData from '@/hooks/useFormData';
import { useAddGoodIssueNote } from '@/hooks/queries/goodNoteQueries';
import { toast } from 'react-toastify';
import { GoodNoteSchema } from '@/lib/zod/schemas';
import { usePathname, useRouter } from '@/lib/i18n/routing';
import {
  useGoodIssueRequests,
  useGoodTransferRequests,
} from '@/hooks/queries/goodRequests';
import { useQuery } from '@tanstack/react-query';
import { getGoodRequestById } from '@/services/goodRequestService';

const IssueCreate = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [initialData, setInitialData] = useState<RowData[]>([]);
  const [data, setData] = useState<RowData[]>([]);
  const [receiverName, setReceiverName] = useState<string>('');
  const { formData, handleChange, setFormData } = useFormData<GoodNote>({
    noteType: 1,
    shipperName: '',
    receiverName: '',
    code: '',
    date: '',
    goodRequestId: '',
    goodNoteDetails: [],
    requestedWarehouseId: '',
  });

  const { data: requests } = useGoodIssueRequests();
  const { data: transferReqs } = useGoodTransferRequests();

  const { data: reqDetails } = useQuery({
    queryKey: ['requestDetails', formData.goodRequestId],
    queryFn: () => getGoodRequestById(formData.goodRequestId || ''),
    enabled: !!formData.goodRequestId,
  });

  const { mutate } = useAddGoodIssueNote();

  const currentWarehouse = useCurrentWarehouse();

  const handleSubmit = () => {
    const finalFormData = {
      ...formData,
      goodNoteDetails: data.map((row) => ({
        quantity: parseFloat(row.quantity.toString()),
        note: row.note,
        batchId: row.batch,
      })),
      requestedWarehouseId: currentWarehouse?.id,
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
    <div className='flex flex-col w-full min-h-[calc(100vh-3rem)] p-4'>
      <div className='flex flex-col w-full'>
        <div className='flex space-x-20 items-center w-full'>
          <div className='text-4xl font-semibold text-primary'>
            Phiếu xuất kho
          </div>
          <div className='flex items-center space-x-2 text-sm'>
            <div className='text-md'>Yêu cầu từ:</div>
            <RequestComboBox
              value={formData.goodRequestId ?? ''}
              requests={requests?.concat(transferReqs || [])}
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
              <div className='text-sm'>Khách hàng</div>
              <Input value={receiverName} disabled />
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
              <div className='text-sm'>Kho xuất</div>
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
        <CustomTable initialData={initialData} onDataChange={setData} />
      </div>
      <div className='flex w-full'>
        <div className='grow'></div>
        <Button onClick={handleSubmit}>Tạo phiếu</Button>
      </div>
    </div>
  );
};

export default IssueCreate;
