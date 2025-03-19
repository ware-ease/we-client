'use client';
import { Input } from '@/app/_components/shadcn-base/Input';
import React, { useState } from 'react';
import RequestComboBox from './RequestComboBox';
import { Button } from '@/app/_components/shadcn-base/Button';
import CustomTable, {
  RowData,
} from '@/app/_components/custom-table/CustomTable';
import { useCurrentWarehouse } from '@/lib/hooks/useCurrentWarehouse';
import { useQuery } from '@tanstack/react-query';
import { getAllGoodReceiveRequests } from '@/lib/services/goodRequestService';

const ReceiptCreate = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string>('');
  const [supplierName, setSupplierName] = useState<string>('');

  const { data: requests } = useQuery({
    queryKey: ['requests'],
    queryFn: getAllGoodReceiveRequests,
  });

  const currentWarehouse = useCurrentWarehouse();

  const handleSubmit = () => {
    console.log(data);
    console.log(requests);
    console.log(selectedRequest);
  };

  const handleRequestSelect = (value: string) => {
    const req = requests?.find((req) => req.id === value);
    setSelectedRequest(req?.id ?? '');
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
              value={selectedRequest}
              requests={requests}
              onChange={(value) => handleRequestSelect(value)}
            />
          </div>
        </div>
        <div className='flex space-x-20 py-5 pl-3'>
          <div className='flex flex-col space-y-2'>
            <div className='w-64'>
              <div className='text-sm'>Mã phiếu</div>
              <Input name='code' required />
            </div>
            <div className='w-64'>
              <div className='text-sm'>Ngày tạo</div>
              <Input name='date' type='date' required />
            </div>
          </div>
          <div className='flex flex-col space-y-2'>
            <div className='w-64'>
              <div className='text-sm'>Nhà cung cấp</div>
              <Input value={supplierName} disabled />
            </div>
            <div className='w-64'>
              <div className='text-sm'>Người giao hàng</div>
              <Input name='shipper' required />
            </div>
          </div>
          <div className='flex flex-col space-y-2'>
            <div className='w-64'>
              <div className='text-sm'>Kho nhập</div>
              <Input value={currentWarehouse?.name ?? ''} disabled />
            </div>
            <div className='w-64'>
              <div className='text-sm'>Diễn giải</div>
              <Input name='explanation' required />
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
