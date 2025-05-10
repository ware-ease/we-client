'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { Label } from '@/components/shadcn-base/Label';
import { Customer } from '@/types/customer';
import { Eye } from 'lucide-react';
import React from 'react';

type ViewCustomerDialogProps = {
  customer: Customer;
};

const ViewCustomerDialog: React.FC<ViewCustomerDialogProps> = ({
  customer,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Eye className='text-blue-600 h-5 w-5 hover:cursor-pointer' />
      </DialogTrigger>

      <DialogContent
        className='flex flex-col w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl border border-gray-200 max-h-[80vh] overflow-y-auto'
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold text-gray-800'>
            Thông tin khách hàng
          </DialogTitle>
        </DialogHeader>

        <div className='mt-4 space-y-6 text-sm text-gray-800'>
          <div>
            <h3 className='text-base font-semibold text-gray-700 mb-2'>
              Chi tiết khách hàng
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='text-sm text-gray-500'>Tên khách hàng</Label>
                <p className='mt-1 text-gray-900'>{customer.name || '-'}</p>
              </div>
              <div>
                <Label className='text-sm text-gray-500'>Số điện thoại</Label>
                <p className='mt-1 text-gray-900'>{customer.phone || '-'}</p>
              </div>
              {/* <div>
                <Label className='text-sm text-gray-500'>Email</Label>
                <p className='mt-1 text-gray-900'>{customer.email || '-'}</p>
              </div>
              <div>
                <Label className='text-sm text-gray-500'>Địa chỉ</Label>
                <p className='mt-1 text-gray-900'>{customer.address || '-'}</p>
              </div> */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCustomerDialog;
