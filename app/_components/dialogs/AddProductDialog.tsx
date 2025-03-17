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
import { TranslatedMessage } from '@/app/_components/TranslatedMessage';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ProductTypeComboBox from '../combo-boxes/ProductTypeComboBox';
import BrandComboBox from '../combo-boxes/BrandComboBox';
import UnitComboBox from '../combo-boxes/UnitComboBox';

const AddProductDialog = () => {
  const t = useTranslations();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    productTypeId: '',
    unitId: '',
    brandId: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Submitted product data:', formData);
    toast.success('Product created successfully!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='px-4 py-2 rounded-lg'>
          <TranslatedMessage tKey='Management.create' />
        </Button>
      </DialogTrigger>
      <DialogContent
        className='flex flex-col w-full max-w-4xl p-6 m-4 bg-white rounded-lg shadow-lg border border-gray-200 !overflow-visible fixed'
        // style={{
        //   position: 'fixed',
        //   top: '50%',
        //   left: '50%',
        //   transform: 'translate(-50%, -50%)',
        // }}
      >
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-gray-800'>
            Tạo sản phẩm mới
          </DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <Label htmlFor='name'>Tên sản phẩm</Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='sku'>SKU</Label>
            <Input
              id='sku'
              name='sku'
              value={formData.sku}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className=''>
            <Label htmlFor='productTypeId'>Loại sản phẩm</Label>
            <div className='border-black border rounded-md'>
              <ProductTypeComboBox
                value={formData.productTypeId}
                onChange={(value) => handleSelectChange(value, 'productTypeId')}
              />
            </div>
          </div>
          <div>
            <Label htmlFor='unitId'>Đơn vị</Label>
            <div className='border-black border rounded-md'>
              <UnitComboBox
                value={formData.unitId}
                onChange={(value) => handleSelectChange(value, 'unitId')}
              />
            </div>
          </div>
          <div>
            <Label>Hãng</Label>
            <div className='border-black border rounded-md'>
              <BrandComboBox
                value={formData.brandId}
                onChange={(value) => handleSelectChange(value, 'brandId')}
              />
            </div>
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

export default AddProductDialog;
