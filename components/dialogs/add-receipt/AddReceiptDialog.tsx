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
import { Input } from '@/components/shadcn-base/Input';
import { Label } from '@/components/shadcn-base/Label';
import { TranslatedMessage } from '@/components/app/TranslatedMessage';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { DataTable } from './DataTable';
import { columns } from './Columns';

const AddReceiptDialog = () => {
  const t = useTranslations();

  const handleSubmit = () => {
    toast.success('Account created successfully!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='px-4 py-2 rounded-lg'>
          <TranslatedMessage tKey='Management.create' />
        </Button>
      </DialogTrigger>
      <DialogContent
        className='flex flex-col w-full max-w-4xl p-6 m-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto'
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-gray-800'>
            {t('Dialog.title.accountCreate')}
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col'>
          <div className='flex'>
            <div className='flex flex-col'>
              <div>
                <Label htmlFor='code'>Mã phiếu</Label>
                <Input name='code' required />
              </div>
              <div>
                <Label htmlFor='date'>Ngày tạo</Label>
                <Input name='date' type='date' required />
              </div>
              <div>
                <Label htmlFor='supplier'>Nhà cung cấp</Label>
                <Input name='supplier' required />
              </div>
            </div>
            <div className='flex flex-col'>
              <div>
                <Label htmlFor='shipper'>Người giao hàng</Label>
                <Input name='shipper' required />
              </div>
              <div>
                <Label htmlFor='warehouse'>Kho nhập</Label>
                <Input name='warehouse' required />
              </div>
            </div>
          </div>
          <div>
            <DataTable columns={columns} data={[]} />
          </div>
        </div>
        <DialogFooter className='mt-6 flex justify-end space-x-4'>
          <DialogClose asChild>
            <Button
              variant='secondary'
              className='px-4 py-2 hover:bg-slate-200'
            >
              {t('Dialog.cancel')}
            </Button>
          </DialogClose>
          <Button className='px-4 py-2 rounded-lg' onClick={handleSubmit}>
            {t('Dialog.yes.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddReceiptDialog;
