'use client';
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
} from '@/components/shadcn-base/AlertDialog';
import { ReactNode, useState } from 'react';

interface ExportDialogProps {
  isLoading?: boolean;
  children: ReactNode;
  title: string;
  description?: string;
  onConfirmExport: () => void;
}

export function ExportDialog({
  isLoading = false,
  children,
  title,
  description,
  onConfirmExport,
}: ExportDialogProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmExport}
            disabled={isLoading}
            className='bg-green-600 hover:bg-green-700'
          >
            {isLoading ? 'Đang xuất...' : 'Xuất'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
