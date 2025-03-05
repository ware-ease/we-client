'use client';

import { Button } from '@/app/_components/shadcn-base/Button';
import { Checkbox } from '@/app/_components/shadcn-base/Checkbox';
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
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { TranslatedMessage } from '../TranslatedMessage';

const AddSupplierDialog = () => {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    status: true, // Mặc định là active
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({ ...prev, status: !prev.status }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Vui lòng điền đầy đủ thông tin nhà cung cấp.');
      return;
    }

    console.log('Supplier submitted:', formData);
    toast.success('Nhà cung cấp đã được thêm thành công!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='px-4 py-2 rounded-lg'>
          <TranslatedMessage tKey='Management.create' />
        </Button>
      </DialogTrigger>
      <DialogContent
        className='flex flex-col w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg border border-gray-200'
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-gray-800'>
            Thêm Nhà Cung Cấp
          </DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <Label htmlFor='name'>Tên Nhà Cung Cấp</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='phone'>Số Điện Thoại</Label>
            <Input
              id='phone'
              name='phone'
              type='tel'
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='address'>Địa Chỉ</Label>
            <Input
              id='address'
              name='address'
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='status'
              checked={formData.status}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor='status'>Hoạt động</Label>
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

export default AddSupplierDialog;
