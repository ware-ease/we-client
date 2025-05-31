'use client';

import { Button } from '@/components/shadcn-base/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { Input } from '@/components/shadcn-base/Input';
import { Label } from '@/components/shadcn-base/Label';
import { useAddWarehouse } from '@/hooks/queries/warehouseQueries';
import { Warehouse } from '@/types/warehouse';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Map from '../app/Map';

const AddWarehouseDialog = () => {
  const t = useTranslations();
  const addWarehouse = useAddWarehouse();
  const [open, setOpen] = useState(false);

  const initialFormData: Warehouse = {
    id: '',
    name: '',
    phone: '',
    address: '',
    area: 1,
    operateFrom: '',
    latitude: 10.76,
    longitude: 106.66,
  };

  const [formData, setFormData] = useState<Warehouse>(initialFormData);

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev: Warehouse) => {
      let parsedValue: string | number = value;

      switch (name) {
        case 'area':
          parsedValue = Number(value);
          break;
        case 'latitude':
        case 'longitude':
          parsedValue = parseFloat(value) || 0;
          break;
        case 'operateFrom':
          parsedValue = value.toString();
          break;
      }

      return {
        ...prev,
        [name]: parsedValue,
      };
    });
  };

  // const handleLocationSelect = (coords: { lat: number; lng: number }) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     latitude: coords.lat,
  //     longitude: coords.lng,
  //   }));
  // };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.address || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Số điện thoại không hợp lệ. Vui lòng nhập 10-11 số.');
      return;
    }

    try {
      await addWarehouse.mutateAsync(formData);
      toast.success('Tạo kho thành công!');
      setOpen(false); // Đóng dialog
      resetForm(); // Reset form
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error creating warehouse:', error);
      toast.error(
        error.response?.data?.message ||
          'Có lỗi xảy ra khi tạo kho. Vui lòng thử lại.'
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='px-4 py-2 rounded-lg' onClick={() => setOpen(true)}>
          Tạo kho
        </Button>
      </DialogTrigger>

      <DialogContent className='flex flex-col w-full max-w-2xl max-h-[90vh] p-6 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold text-gray-800'>
            Tạo kho
          </DialogTitle>
          <DialogDescription className='text-sm text-gray-500'>
            Nhập thông tin để tạo kho mới. Các trường có dấu * là bắt buộc.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4 px-2 space-y-6 text-sm text-gray-800 overflow-y-auto'>
          {/* --- THÔNG TIN KHO --- */}
          <div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='col-span-2'>
                <Label htmlFor='name' className='text-sm text-gray-500'>
                  Tên kho *
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
                <Label htmlFor='phone' className='text-sm text-gray-500'>
                  Số điện thoại *
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

              <div className='col-span-2'>
                <Label htmlFor='address' className='text-sm text-gray-500'>
                  Địa chỉ *
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
                <Label htmlFor='area' className='text-sm text-gray-500'>
                  Diện tích (m²)
                </Label>
                <Input
                  id='area'
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
                <Label className='text-sm text-gray-500'>
                  Vị trí trên bản đồ
                </Label>
                <div className='mt-1 rounded-lg overflow-hidden border border-gray-200'>
                  <Map
                    className='h-[250px]'
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onLocationSelect={(coords: {
                      lat: number;
                      lng: number;
                    }) => {
                      setFormData((prev) => ({
                        ...prev,
                        latitude: coords.lat,
                        longitude: coords.lng,
                      }));
                    }}
                    onAddressFound={(address: string) => {
                      setFormData((prev) => ({
                        ...prev,
                        address,
                      }));
                    }}
                  />
                </div>
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
