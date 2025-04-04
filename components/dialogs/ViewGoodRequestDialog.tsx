'use client';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { View } from 'lucide-react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { GoodRequest } from '@/types/goodRequest';
import { Button } from '../shadcn-base/Button';
import { useConfirmGoodRequest } from '@/hooks/queries/goodRequests';

interface GoodRequestDialogProps {
  goodRequest: GoodRequest;
}

export function ViewGoodRequestDialog({ goodRequest }: GoodRequestDialogProps) {
  const confirmMutation = useConfirmGoodRequest();

  const handleConfirm = () => {
    confirmMutation.mutate(goodRequest.id || '');
  };

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
        <div className='flex flex-col items-center pb-6'>
          {goodRequest.goodNote?.code || 'Chưa lập phiếu'}
          {goodRequest.goodNote && (
            <Button className='w-1/3' onClick={handleConfirm}>
              Xác nhận
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
