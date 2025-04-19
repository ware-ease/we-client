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
import { useCompleteGoodRequest } from '@/hooks/queries/goodRequests';

interface CompleteRequestDialogProps {
  requestId: string;
  requestCode?: string;
}

const CompleteRequestDialog = ({
  requestId,
  requestCode,
}: CompleteRequestDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate: complete, isPending } = useCompleteGoodRequest();

  const handleApprove = () => {
    complete(requestId);
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
          <AlertDialogTitle>Hoàn thành yêu cầu</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn hoàn thành yêu cầu {requestCode}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleApprove}
            disabled={isPending}
            className='bg-green-600 hover:bg-green-700'
          >
            {isPending ? 'Đang hoàn thành...' : 'Hoàn thành'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompleteRequestDialog;
