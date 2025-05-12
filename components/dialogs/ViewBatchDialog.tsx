'use client';

import { Button } from '@/components/shadcn-base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { Label } from '@/components/shadcn-base/Label';
import { Batch } from '@/types/batch';
import { Eye } from 'lucide-react';
import React from 'react';
import CreatedByUI from '../app/CreatedByUI';

type ViewBatchDialogProps = {
  batch: Batch;
};

const ViewBatchDialog: React.FC<ViewBatchDialogProps> = ({ batch }) => {
  const getDateLabel = (date: string) => {
    return date ? new Date(date).toLocaleDateString('vi-VN') : 'Không có';
  };

  return (
    <div className='flex justify-end'>
      <Dialog>
        <DialogTrigger asChild>
          <Eye className='text-blue-500 h-5 w-5 hover:cursor-pointer' />
        </DialogTrigger>
        <DialogContent
          className='flex flex-col w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6 m-4 bg-white rounded-2xl shadow-xl border border-gray-200'
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <DialogHeader>
            <DialogTitle className='text-2xl font-semibold text-gray-800'>
              Chi tiết lô hàng
            </DialogTitle>
          </DialogHeader>

          <div className='mt-4 space-y-6 text-sm text-gray-800'>
            {/* --- THÔNG TIN LÔ HÀNG --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin lô hàng
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm text-gray-500'>Mã lô hàng</Label>
                  <p>{batch.code}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Tên sản phẩm</Label>
                  <p>{batch.productName || 'Không có tên sản phẩm'}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Ngày nhập</Label>
                  <p>{getDateLabel(batch.inboundDate)}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Ngày sản xuất</Label>
                  <p>{getDateLabel(batch.mfgDate)}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Hạn sử dụng</Label>
                  <p>{getDateLabel(batch.expDate)}</p>
                </div>
              </div>
            </div>

            {/* --- NGƯỜI TẠO & THỜI GIAN --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin tạo
              </h3>
              <div className='grid grid-cols-2 gap-4 items-center'>
                <div className='flex items-center gap-3'>
                  <CreatedByUI
                    fullName={batch.createdByFullName || 'Hệ thống'}
                    group={batch.createdByGroup || 'Không có nhóm'}
                    avatarUrl={
                      batch.createdByAvatarUrl ||
                      'https://github.com/shadcn.png'
                    }
                  />
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Ngày tạo</Label>
                  <p>{getDateLabel(batch.createdTime)}</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className='mt-6 flex justify-end'>
            <DialogClose asChild>
              <Button
                variant='secondary'
                className='px-4 py-2 hover:bg-slate-200'
              >
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewBatchDialog;
