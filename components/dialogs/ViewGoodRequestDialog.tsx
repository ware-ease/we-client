'use client';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { View } from 'lucide-react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { GoodRequest } from '@/types/goodRequest';

interface GoodRequestDialogProps {
  goodRequest: GoodRequest;
}

export function ViewGoodRequestDialog({ goodRequest }: GoodRequestDialogProps) {
  console.log(goodRequest);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <View className='text-blue-500' size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className={`max-w-3xl max-h-screen overflow-auto`}>
        <DialogTitle />
        <DialogDescription />
        <div className='text-center pb-6'>
          {goodRequest.goodNote?.code || 'Chưa lập phiếu'}
        </div>
      </DialogContent>
    </Dialog>
  );
}
