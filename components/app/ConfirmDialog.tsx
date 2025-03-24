import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../shadcn-base/Dialog';
import { useTranslations } from 'next-intl';
import { Button } from '../shadcn-base/Button';

type ConfirmDialogProps = {
  onConfirm: () => void;
  title: string;
  description: string;
  triggerElement: ReactNode;
  confirmText: string;
  confirmBgColor: string;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  onConfirm,
  title,
  description,
  triggerElement,
  confirmText,
  confirmBgColor,
}) => {
  const t = useTranslations();

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className='justify-end'>
          <DialogClose asChild>
            <Button variant='secondary' className='hover:bg-slate-200'>
              {t('Settings.cancel')}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className={confirmBgColor} onClick={onConfirm}>
              {confirmText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
