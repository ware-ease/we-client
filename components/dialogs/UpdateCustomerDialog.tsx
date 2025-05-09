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
import { Customer } from '@/types/customer';
import { Edit } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

type UpdateCustomerDialogProps = {
  customer: Customer;
};

const UpdateCustomerDialog: React.FC<UpdateCustomerDialogProps> = ({
  customer,
}) => {
  const t = useTranslations();

  const [formData, setFormData] = useState({
    name: customer.name || '',
    phone: customer.phone || '',
    email: customer.email || '',
    address: customer.address || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateClick = () => {
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error('Please fill in all required fields.');
      return;
    }

    console.log('Updated customer data:', formData);
    toast.success('Customer updated successfully!');
  };

  return (
    <div className='flex justify-end'>
      <Dialog>
        <DialogTrigger asChild>
          <Edit className='text-yellow-600 h-4 w-4 hover:cursor-pointer' />
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
              Chỉnh sửa thông tin khách hàng
            </DialogTitle>
          </DialogHeader>
          <div className='grid grid-cols-1 gap-6'>
            <div>
              <Label htmlFor='name'>Tên khách hàng</Label>
              <Input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor='phone'>Số điện thoại</Label>
              <Input
                id='phone'
                name='phone'
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
              <Label htmlFor='address'>Địa chỉ</Label>
              <Input
                id='address'
                name='address'
                value={formData.address}
                onChange={handleInputChange}
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
              className='px-4 py-2 rounded-lg'
              onClick={handleUpdateClick}
            >
              {t('Dialog.yes.update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateCustomerDialog;
