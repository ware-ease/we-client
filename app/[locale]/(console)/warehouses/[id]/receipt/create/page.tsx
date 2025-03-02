import { Input } from '@/app/_components/shadcn-base/Input';
import React from 'react';
import { DataTable } from './DataTable';
import { columns } from './Columns';
import { RequestComboBox } from './RequestComboBox';
import { Button } from '@/app/_components/shadcn-base/Button';

const ReceiptCreate = () => {
  return (
    <div className='flex flex-col w-full min-h-[calc(100vh-3rem)] p-4'>
      <div className='flex flex-col w-full justify-between'>
        <div className='flex space-x-20 items-center w-full'>
          <div className='text-4xl font-semibold text-primary'>
            Phiếu nhập kho
          </div>
          <div className='flex items-center space-x-4'>
            <div className='text-md'>Yêu cầu từ:</div>
            <RequestComboBox />
          </div>
        </div>
        <div className='flex space-x-20 py-5 pl-3'>
          <div className='flex flex-col'>
            <div className='w-64'>
              <div className='text-md'>Mã phiếu</div>
              <Input name='code' required />
            </div>
            <div className='w-64'>
              <div className='text-md'>Ngày tạo</div>
              <Input name='date' type='date' required />
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='w-64'>
              <div className='text-md'>Nhà cung cấp</div>
              <Input name='supplier' required />
            </div>
            <div className='w-64'>
              <div className='text-md'>Người giao hàng</div>
              <Input name='shipper' required />
            </div>
          </div>
          <div className='flex flex-col'>
            <div className='w-64'>
              <div className='text-md'>Kho nhập</div>
              <Input name='warehouse' required />
            </div>
            <div className='w-64'>
              <div className='text-md'>Diễn giải</div>
              <Input name='explanation' required />
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-grow w-full'>
        <div className='grow'></div>
        <Button>Tạo phiếu</Button>
      </div>
      <div>
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
};

export default ReceiptCreate;
