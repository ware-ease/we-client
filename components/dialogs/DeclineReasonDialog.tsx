import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../shadcn-base/Dialog';

interface DeclineReasonDialogProps {
  reason: string;
  code: string;
}

const DeclineReasonDialog = ({ reason, code }: DeclineReasonDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={`flex items-center justify-center rounded-xl py-1 text-xs bg-red-500 text-white font-medium cursor-pointer`}
        >
          <span>Đã từ chối</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lý do từ chối</DialogTitle>
          <DialogDescription className='text-md'>
            Yêu cầu có mã {code} bị từ chối vì lý do như sau: <br />-{' '}
            {reason || 'Không có'}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeclineReasonDialog;
