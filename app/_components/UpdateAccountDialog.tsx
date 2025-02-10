import React, { useState } from 'react';
import { Button } from '@/app/_components/shadcn-base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/shadcn-base/Dialog';
import { Input } from '@/app/_components/shadcn-base/Input';
import { Pencil } from 'lucide-react';
import { Account } from '../[locale]/(console)/accounts/Columns';
import { useTranslations } from 'next-intl';

type UpdateAccountDialogProps = {
  account: Account;
};

const UpdateAccountDialog: React.FC<UpdateAccountDialogProps> = ({
  account,
}) => {
  const t = useTranslations();

  const [email, setEmail] = useState<string>(account.email);

  const handleUpdateClick = () => {
    //TODO: API here
    console.log(email);
  };

  return (
    <div className='flex justify-end'>
      <Dialog>
        <DialogTrigger asChild>
          <Pencil className='text-yellow-600 h-4 w-4 hover:cursor-pointer' />
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
              {t('Dialog.title.accountUpdate')}
            </DialogTitle>
          </DialogHeader>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              <Input
                id='email'
                name='email'
                value={account.email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
            <Button
              className='px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600'
              onClick={() => handleUpdateClick()}
            >
              {t('Dialog.yes.update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateAccountDialog;
