'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn-base/Avatar';
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
  // const [updatedAt, setUpdatedAt] = useState<string>(account.updatedAt || '');

  // const handleStatusUpdate = (updatedAccount: { updatedAt: string }) => {
  //   setUpdatedAt(updatedAccount.updatedAt);
  // };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return (
          <span className='text-yellow-600 font-medium'>Chưa xác thực</span>
        );
      case 1:
        return <span className='text-green-600 font-medium'>Đã xác thực</span>;
      case 2:
        return <span className='text-red-600 font-medium'>Đã khóa</span>;
      default:
        return <span className='text-gray-500'>Không rõ</span>;
    }
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
                <div>
                  <Label className='text-sm text-gray-500'>Trạng thái</Label>
                  <p>{getStatusLabel(account.status ?? 0)}</p>
                </div>
                {/* {account.updatedAt && (
                  <div>
                    <Label className='text-sm text-gray-500'>
                      Cập nhật trạng thái lúc
                    </Label>
                    <p>{new Date(account.updatedAt).toLocaleString('vi-VN')}</p>
                  </div>
                )} */}
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
              <div className='bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-wrap gap-2'>
                {account.groups?.length
                  ? account.groups.map((g) => (
                      <span
                        key={g.id}
                        className='px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800'
                      >
                        {g.name}
                      </span>
                    ))
                  : 'Không có'}
              </div>
            </div>

            {/* --- KHO PHÂN QUYỀN --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Kho được phân quyền
              </h3>
              <div className='bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-wrap gap-2'>
                {account.warehouses?.length
                  ? account.warehouses.map((w) => (
                      <span
                        key={w.id}
                        className='px-3 py-1 rounded-full text-sm bg-green-100 text-green-800'
                      >
                        {w.name}
                      </span>
                    ))
                  : 'Không có'}
              </div>
            </div>

            {/* --- NGƯỜI TẠO & THỜI GIAN --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin tạo
              </h3>
              <div className='grid grid-cols-2 gap-4 items-center'>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={account.createdByAvatarUrl} />
                    <AvatarFallback>
                      {account.createdByFullName?.[0] ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>{account.createdByFullName}</p>
                    <p className='text-xs text-gray-500'>
                      {account.createdByGroup}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Ngày tạo</Label>
                  <p>
                    {new Date(account.createdTime || '').toLocaleString(
                      'vi-VN'
                    )}
                  </p>
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

export default ViewAccountDialog;
