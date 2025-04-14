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
import { Warehouse } from '@/types/warehouse';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Map from '../app/Map';

const AddWarehouseDialog = () => {
  const t = useTranslations();

  const [formData, setFormData] = useState<Warehouse>({
    id: '',
    name: '',
    address: '',
    area: 0,
    operateFrom: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Convert numeric values for length and width
      [name]: name === 'area' ? Number(value) : value,
      [name]: name === 'operateFrom' ? value.toString() : value,
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.address) {
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
        className='flex flex-col w-full max-w-2xl max-h-[90vh] p-6 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-y-auto'
        style={{ overflow: 'visible' }}
      >
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold text-gray-800'>
            Tạo kho
          </DialogTitle>
        </DialogHeader>

        <div className='mt-4 space-y-6 text-sm text-gray-800'>
          {/* --- THÔNG TIN KHO --- */}
          <div>
            <h3 className='text-base font-semibold text-gray-700 mb-2'>
              Thông tin kho
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2'>
                <Label htmlFor='name' className='text-sm text-gray-500'>
                  Tên kho
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

              <div className='col-span-2'>
                <Label htmlFor='address' className='text-sm text-gray-500'>
                  Địa chỉ
                </Label>
                <Input
                  id='address'
                  name='address'
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                />
              </div>

              <div>
                <Label htmlFor='length' className='text-sm text-gray-500'>
                  Diện tích (m²)
                </Label>
                <Input
                  id='length'
                  name='area'
                  type='number'
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                />
              </div>

              <div>
                <Label htmlFor='operateFrom' className='text-sm text-gray-500'>
                  Hoạt động từ
                </Label>
                <Input
                  id='operateFrom'
                  name='operateFrom'
                  type='date'
                  value={formData.operateFrom}
                  onChange={handleInputChange}
                  required
                  className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                />
              </div>
              <div className='col-span-2'>
                <Map />
              </div>
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
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            onClick={handleSubmit}
          >
            {t('Dialog.yes.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWarehouseDialog;
