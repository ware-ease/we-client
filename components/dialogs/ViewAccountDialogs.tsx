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
import { Account } from '@/types/account';
import { Eye } from 'lucide-react';
import React from 'react';

type DetailAccountDialogProps = {
  account: Account;
};

const ViewAccountDialog: React.FC<DetailAccountDialogProps> = ({ account }) => {
  return (
    <div className='flex justify-end'>
      <Dialog>
        <DialogTrigger asChild>
          <Eye className='text-blue-600 h-5 w-5 hover:cursor-pointer' />
        </DialogTrigger>
        <DialogContent
          className='flex flex-col w-full max-w-3xl p-6 m-4 bg-white rounded-2xl shadow-xl border border-gray-200'
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <DialogHeader>
            <DialogTitle className='text-2xl font-semibold text-gray-800'>
              Chi tiết tài khoản
            </DialogTitle>
          </DialogHeader>

          <div className='mt-4 space-y-6 text-sm text-gray-800'>
            {/* --- THÔNG TIN TÀI KHOẢN --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin tài khoản
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm text-gray-500'>Tên đăng nhập</Label>
                  <p>{account.username}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Email</Label>
                  <p>{account.email}</p>
                </div>
              </div>
            </div>

            {/* --- THÔNG TIN CÁ NHÂN --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin cá nhân
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm text-gray-500'>Họ</Label>
                  <p>{account.profile?.lastName}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Tên</Label>
                  <p>{account.profile?.firstName}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Số điện thoại</Label>
                  <p>{account.profile?.phone}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Quốc tịch</Label>
                  <p>{account.profile?.nationality}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Giới tính</Label>
                  <p>{account.profile?.sex ? 'Nam' : 'Nữ'}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Địa chỉ</Label>
                  <p>{account.profile?.address}</p>
                </div>
              </div>
            </div>

            {/* --- NHÓM NGƯỜI DÙNG --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Nhóm người dùng
              </h3>
              <div className='bg-gray-50 border border-gray-200 rounded-lg p-3'>
                <p>
                  {account.groups?.map((g) => g.name).join(', ') || 'Không có'}
                </p>
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

export default ViewAccountDialog;
