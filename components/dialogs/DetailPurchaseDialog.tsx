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
import { Label } from '@/components/shadcn-base/Label';
import { PurchaseDetail } from '@/types/purchase';
import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

type DetailPurchaseDialogProps = {
  purchase: PurchaseDetail;
};

const DetailPurchaseDialog: React.FC<DetailPurchaseDialogProps> = ({
  purchase,
}) => {
  const t = useTranslations();

  return (
    <div className='flex justify-end'>
      <Dialog>
        <DialogTrigger asChild>
          <Eye className='text-blue-600 h-5 w-5 hover:cursor-pointer' />
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
              {t('Dialog.title.purchaseDetail')}
            </DialogTitle>
          </DialogHeader>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              <Label>{t('Purchase.orderNumber')}</Label>
              <p className='text-gray-700'>{purchase.orderNumber}</p>
            </div>
            <div>
              <Label>{t('Purchase.supplier')}</Label>
              <p className='text-gray-700'>{purchase.supplier}</p>
            </div>
            <div>
              <Label>{t('Purchase.totalAmount')}</Label>
              <p className='text-gray-700'>
                ${purchase.totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <Label>{t('Purchase.status')}</Label>
              <p className='text-gray-700'>{purchase.status}</p>
            </div>
            <div className='col-span-2'>
              <Label>{t('Purchase.date')}</Label>
              <p className='text-gray-700'>{purchase.date}</p>
            </div>
          </div>

          <div className='mt-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>
              {t('Purchase.items')}
            </h3>
            <div className='border rounded-lg p-4 bg-gray-50'>
              {purchase.items.length > 0 ? (
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='border-b'>
                      <th className='p-2'>{t('Purchase.product')}</th>
                      <th className='p-2'>{t('Purchase.quantity')}</th>
                      <th className='p-2'>{t('Purchase.price')}</th>
                      <th className='p-2'>{t('Purchase.total')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchase.items.map((item) => (
                      <tr key={item.id} className='border-b'>
                        <td className='p-2'>{item.productName}</td>
                        <td className='p-2'>{item.quantity}</td>
                        <td className='p-2'>${item.price.toFixed(2)}</td>
                        <td className='p-2'>${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className='text-gray-600'>{t('Purchase.noItems')}</p>
              )}
            </div>
          </div>

          <DialogFooter className='mt-6 flex justify-end'>
            <DialogClose asChild>
              <Button
                variant='secondary'
                className='px-4 py-2 hover:bg-slate-200'
              >
                {t('Dialog.close')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailPurchaseDialog;
