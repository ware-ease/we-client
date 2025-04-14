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

interface DeclineRequestDialogProps {
  requestId: string;
  requestCode?: string;
}

const DeclineRequestDialog = ({
  requestId,
  requestCode,
}: DeclineRequestDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: decline, isPending } = useDeclineGoodRequest();

  const handleApprove = () => {
    decline(requestId);
    setOpen(false);
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
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleApprove}
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
