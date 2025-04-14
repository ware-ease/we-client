'use client';
import { Check } from 'lucide-react';
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
import { useConfirmGoodRequest } from '@/hooks/queries/goodRequests';

interface ApproveRequestDialogProps {
  requestId: string;
  requestCode?: string;
}

const ApproveRequestDialog = ({
  requestId,
  requestCode,
}: ApproveRequestDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: approve, isPending } = useConfirmGoodRequest();

  const handleApprove = () => {
    approve(requestId);
    setOpen(false);
  };

  if (!requestCode || !requestId) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Check className='text-green-500' size={20} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận yêu cầu</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn đồng ý yêu cầu {requestCode}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleApprove}
            disabled={isPending}
            className='bg-green-600 hover:bg-green-700'
          >
            {isPending ? 'Đang đồng ý...' : 'Đồng ý'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApproveRequestDialog;
