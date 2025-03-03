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
import { Warehouse } from '@/lib/types/warehouse';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';

const AddWarehouseDialog = () => {
  const t = useTranslations();

  const [formData, setFormData] = useState<Warehouse>({
    id: '', // You might generate this on the backend
    name: '',
    address: '',
    length: 0,
    width: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Convert numeric values for length and width
      [name]: name === 'length' || name === 'width' ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.address ||
      formData.length <= 0 ||
      formData.width <= 0
    ) {
      toast.error('Please fill in all required fields with valid values.');
      return;
    }

    // Submit the form data to your API
    console.log('Submitted Warehouse data:', formData);
    toast.success('Warehouse created successfully!');
    // Optionally: clear form or close the dialog after success
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='px-4 py-2 rounded-lg'>
          {/* <TranslatedMessage tKey='Management.createWarehouse' /> */}
          Tạo kho
        </Button>
      </DialogTrigger>
      <DialogContent
        className='flex flex-col w-full max-w-2xl p-6 m-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto'
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-gray-800'>
            Tạo kho
          </DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-6'>
          <div className='col-span-2'>
            <Label htmlFor='name'>Tên kho</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='col-span-2'>
            <Label htmlFor='address'>Địa chỉ</Label>
            <Input
              id='address'
              name='address'
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='length'>Chiều dài</Label>
            <Input
              id='length'
              name='length'
              type='number'
              value={formData.length}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='width'>Chiều rộng</Label>
            <Input
              id='width'
              name='width'
              type='number'
              value={formData.width}
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

export default AddWarehouseDialog;
