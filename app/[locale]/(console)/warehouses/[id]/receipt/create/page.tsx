import { Input } from '@/app/_components/shadcn-base/Input';
import { Label } from '@/app/_components/shadcn-base/Label';
import React from 'react';
import { DataTable } from './DataTable';
import { columns } from './Columns';
import { RequestComboBox } from './RequestComboBox';

const ReceiptCreate = () => {
  return (
    <div className='flex flex-col w-full'>
      <div className='flex space-x-20 w-full'>
        <div className='text-4xl font-semibold text-primary'>
          Phiếu nhập kho
        </div>
        <div className='flex flex-col'>
          <div className='w-64'>
            <Label htmlFor='code'>Mã phiếu</Label>
            <Input name='code' required />
          </div>
          <div className='w-64'>
            <Label htmlFor='date'>Ngày tạo</Label>
            <Input name='date' type='date' required />
          </div>
          <div className='w-64'>
            <Label htmlFor='supplier'>Nhà cung cấp</Label>
            <Input name='supplier' required />
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='w-64'>
            <Label htmlFor='shipper'>Người giao hàng</Label>
            <Input name='shipper' required />
          </div>
          <div className='w-64'>
            <Label htmlFor='warehouse'>Kho nhập</Label>
            <Input name='warehouse' required />
          </div>
          <div className='w-64'>
            <Label htmlFor='explanation'>Diễn giải</Label>
            <Input name='explanation' required />
          </div>
        </div>
        <div className='flex flex-col'>
          <Label htmlFor='request'>Yêu cầu từ</Label>
          <RequestComboBox />
        </div>
      </div>
      <div>
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
};

export default ReceiptCreate;
