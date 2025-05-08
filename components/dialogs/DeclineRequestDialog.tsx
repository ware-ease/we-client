'use client';
import { X } from 'lucide-react';
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
import { useDeclineGoodRequest } from '@/hooks/queries/goodRequests';
import { toast } from 'react-toastify';

interface DeclineRequestDialogProps {
  requestId: string;
  requestCode?: string;
}

const DeclineRequestDialog = ({
  requestId,
  requestCode,
}: DeclineRequestDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const { mutate: decline, isPending } = useDeclineGoodRequest();

  const handleDecline = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!reason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối.');
      e.preventDefault();
    } else {
      decline({ id: requestId, reason });
      setOpen(false);
    }
  };

  if (!requestCode || !requestId) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <X className='text-red-500' size={20} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Từ chối yêu cầu</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn từ chối yêu cầu {requestCode}?
          </AlertDialogDescription>
          <div className='flex flex-col gap-2'>
            <input
              type='text'
              placeholder='Lý do từ chối'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className='w-full rounded-md border border-gray-300 p-2 text-sm'
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => handleDecline(e)}
            disabled={isPending}
            className='bg-red-600 hover:bg-red-700'
          >
            {isPending ? 'Đang từ chối...' : 'Từ chối'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeclineRequestDialog;
