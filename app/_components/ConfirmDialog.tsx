import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './shadcn-base/Dialog';
import { useTranslations } from 'next-intl';
import { Button } from './shadcn-base/Button';

type ConfirmDialogProps = {
  onConfirm: () => void;
  title: string;
  description: string;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  onConfirm,
  title,
  description,
}) => {
  const t = useTranslations();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='hover:font-semibold hover:cursor-pointer'>
          {t('Settings.change')}
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className='justify-end'>
          <DialogClose asChild>
            <Button variant='secondary'>{t('Settings.cancel')}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onConfirm}>{t('Settings.update')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
