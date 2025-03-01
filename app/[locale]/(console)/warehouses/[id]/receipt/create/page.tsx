import { Input } from '@/app/_components/shadcn-base/Input';
import { Label } from '@/app/_components/shadcn-base/Label';
import React from 'react';
import { DataTable } from './DataTable';
import { columns } from './Columns';

const ReceiptCreate = () => {
  return (
    <div className='flex flex-col'>
      <div className='flex'>
        <div className='flex flex-col'>
          <div>
            <Label htmlFor='code'>Mã phiếu</Label>
            <Input name='code' required />
          </div>
          <div>
            <Label htmlFor='date'>Ngày tạo</Label>
            <Input name='date' type='date' required />
          </div>
          <div>
            <Label htmlFor='supplier'>Nhà cung cấp</Label>
            <Input name='supplier' required />
          </div>
        </div>
        <div className='flex flex-col'>
          <div>
            <Label htmlFor='shipper'>Người giao hàng</Label>
            <Input name='shipper' required />
          </div>
          <div>
            <Label htmlFor='warehouse'>Kho nhập</Label>
            <Input name='warehouse' required />
          </div>
        </div>
      </div>
      <div>
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
};

export default ReceiptCreate;
