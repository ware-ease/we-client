'use client';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { Supplier } from '@/types/supplier';
import { Eye } from 'lucide-react';
import React from 'react';
import { Button } from '../shadcn-base/Button';

type ViewSupplierDialogProps = {
  supplier: Supplier;
};

const ViewSupplierDialog: React.FC<ViewSupplierDialogProps> = ({
  supplier,
}) => {
  return (
    <div className='flex justify-end'>
      <Dialog>
        <DialogTrigger asChild>
          <Eye className='text-blue-600 h-4 w-4 hover:cursor-pointer' />
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
              Chi tiết nhà cung cấp
            </DialogTitle>
          </DialogHeader>

          <div className='mt-4 space-y-6 text-sm text-gray-800'>
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin nhà cung cấp
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-gray-500'>
                    Tên nhà cung cấp
                  </label>
                  <div className='mt-1 p-2 border border-gray-200 rounded-lg bg-gray-50'>
                    {supplier.name}
                  </div>
                </div>
                <div>
                  <label className='text-sm text-gray-500'>Số điện thoại</label>
                  <div className='mt-1 p-2 border border-gray-200 rounded-lg bg-gray-50'>
                    {supplier.phone}
                  </div>
                </div>
                {/* <div>
                  <label className='text-sm text-gray-500'>Email</label>
                  <div className='mt-1 p-2 border border-gray-200 rounded-lg bg-gray-50'>
                    {supplier.email}
                  </div>
                </div>
                <div>
                  <label className='text-sm text-gray-500'>Địa chỉ</label>
                  <div className='mt-1 p-2 border border-gray-200 rounded-lg bg-gray-50'>
                    {supplier.address}
                  </div>
                </div> */}
                <div>
                  <label className='text-sm text-gray-500'>Trạng thái</label>
                  <div
                    className={`mt-1 p-2 border rounded-lg font-medium text-white w-fit ${
                      supplier.status ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {supplier.status ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                  </div>
                </div>
                <div>
                  <label className='text-sm text-gray-500'>Ngày tạo</label>
                  <div className='mt-1 p-2 border border-gray-200 rounded-lg bg-gray-50'>
                    {supplier.createdTime
                      ? new Date(supplier.createdTime).toLocaleString('vi-VN')
                      : 'Không rõ'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className='mt-6 flex justify-end space-x-4'>
            <DialogClose asChild>
              <Button className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'>
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewSupplierDialog;
