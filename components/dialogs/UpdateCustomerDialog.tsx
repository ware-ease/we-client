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
          <Edit className='text-yellow-600 h-5 w-5 hover:cursor-pointer' />
        </DialogTrigger>

        <DialogContent
          className='flex flex-col w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl border border-gray-200 max-h-[80vh] overflow-y-auto'
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <DialogHeader>
            <DialogTitle className='text-2xl font-semibold text-gray-800'>
              Chỉnh sửa khách hàng
            </DialogTitle>
          </DialogHeader>

          <div className='mt-4 space-y-6 text-sm text-gray-800'>
            {/* --- THÔNG TIN KHÁCH HÀNG --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin khách hàng
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='name' className='text-sm text-gray-500'>
                    Tên khách hàng
                  </Label>
                  <Input
                    id='name'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                  />
                </div>
                <div>
                  <Label htmlFor='phone' className='text-sm text-gray-500'>
                    Số điện thoại
                  </Label>
                  <Input
                    id='phone'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                  />
                </div>
                {/* <div> */}
                {/* <Label htmlFor='email' className='text-sm text-gray-500'>
                    Email
                  </Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                  />
                </div>
                <div>
                  <Label htmlFor='address' className='text-sm text-gray-500'>
                    Địa chỉ
                  </Label>
                  <Input
                    id='address'
                    name='address'
                    value={formData.address}
                    onChange={handleInputChange}
                    className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                  />
                </div> */}
              </div>
            </div>
          </div>

          <DialogFooter className='mt-6 flex justify-end space-x-4'>
            <DialogClose asChild>
              <Button
                variant='secondary'
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
              >
                {t('Dialog.cancel')}
              </Button>
            </DialogClose>
            <Button
              className='px-4 py-2 transition-colors'
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
