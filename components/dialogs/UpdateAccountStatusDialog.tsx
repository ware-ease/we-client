'use client';
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../shadcn-base/AlertDialog';
import { useUpdateAccountStatus } from '@/hooks/queries/accountQueries';
import { accountStatusMap } from '@/lib/tanstack-table/customFilterFn';
import { useAuth } from '../providers/AuthProvider';

interface UpdateAccountStatusDialogProps {
  accountId: string;
  username: string;
  currentStatus: number;
}

const UpdateAccountStatusDialog = ({
  accountId,
  username,
  currentStatus,
}: UpdateAccountStatusDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<number>(currentStatus);
  const { mutate: update, isPending } = useUpdateAccountStatus();
  const { currentUser } = useAuth();

  const handleApprove = () => {
    update({ id: accountId, status });
    setOpen(false);
  };

  if (!accountId) {
    return null;
  }

  const statusInfo = accountStatusMap.find(
    (item) => item.status === currentStatus
  ) || {
    label: 'Đã bị khóa',
    color: 'bg-red-500',
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div
          className={`flex items-center justify-center rounded-xl py-1 text-xs ${statusInfo.color} text-white font-medium cursor-pointer`}
        >
          <span>{statusInfo.label}</span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cập nhật trạng thái</AlertDialogTitle>
          <AlertDialogDescription>
            Chọn trạng thái mới cho tài khoản{' '}
            <span className='font-bold'>{username}</span>:
          </AlertDialogDescription>
          <div className='flex space-x-2'>
            {currentUser?.id !== accountId ? (
              accountStatusMap.map((item) => (
                <div
                  key={item.status}
                  className={`flex items-center justify-center rounded-xl px-2 py-1 text-xs ${
                    item.status === status
                      ? item.color + ' text-white'
                      : 'border-2 border-gray-400 hover:bg-slate-100'
                  } font-medium cursor-pointer`}
                  onClick={() => setStatus(item.status)}
                >
                  <span>{item.label}</span>
                </div>
              ))
            ) : (
              <div className='text-red-500 text-sm font-medium'>
                Bạn không thể cập nhật trạng thái của bản thân!
              </div>
            )}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleApprove}
            disabled={isPending || currentStatus === status}
            className='bg-blue-600 hover:bg-blue-700'
          >
            {isPending ? 'Đang cập nhật...' : 'Cập nhật'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateAccountStatusDialog;
