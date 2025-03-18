'use client';
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
import { Label } from '@/app/_components/shadcn-base/Label';
import { TranslatedMessage } from '@/app/_components/app/TranslatedMessage';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddPurchaseDialog = () => {
  const t = useTranslations();

  const [formData, setFormData] = useState({
    supplierName: '',
    product: '',
    quantity: 1,
    price: '',
    purchaseDate: '',
    status: 'pending',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !formData.supplierName ||
      !formData.product ||
      !formData.price ||
      !formData.purchaseDate
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    console.log('Purchase submitted:', formData);
    toast.success('Purchase recorded successfully!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='px-4 py-2 rounded-lg'>
          <TranslatedMessage tKey='Purchases.create' />
        </Button>
      </DialogTrigger>
      <DialogContent
        className='flex flex-col w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg border border-gray-200'
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-gray-800'>
            {t('Dialog.title.purchaseCreate')}
          </DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <Label htmlFor='supplierName'>{t('Purchases.supplier')}</Label>
            <Input
              id='supplierName'
              name='supplierName'
              value={formData.supplierName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='product'>{t('Purchases.product')}</Label>
            <Input
              id='product'
              name='product'
              value={formData.product}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='quantity'>{t('Purchases.quantity')}</Label>
            <Input
              id='quantity'
              name='quantity'
              type='number'
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='price'>{t('Purchases.price')}</Label>
            <Input
              id='price'
              name='price'
              type='number'
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='purchaseDate'>{t('Purchases.date')}</Label>
            <Input
              id='purchaseDate'
              name='purchaseDate'
              type='date'
              value={formData.purchaseDate}
              onChange={handleInputChange}
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
          <Button className='px-4 py-2 rounded-lg' onClick={handleSubmit}>
            {t('Dialog.yes.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPurchaseDialog;
