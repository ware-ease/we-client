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

const AddProductDialog = () => {
  const t = useTranslations();

  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    sku: '',
    categoryId: '',
    unitId: '',
    brandId: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.barcode || !formData.sku) {
      toast.error('Please fill in all required fields.');
      return;
    }

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
            {/* {t('Dialog.title.productCreate')} */}
            Tạo sản phẩm mới
          </DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <Label htmlFor='name'>
              {/* {t('Product.name')} */}
              Tên sản phẩm
            </Label>
            <Input
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='barcode'>
              {/* {t('Product.barcode')} */}
              Mã vạch
            </Label>
            <Input
              id='barcode'
              name='barcode'
              value={formData.barcode}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='sku'>
              {/* {t('Product.sku')} */}
              SKU
            </Label>
            <Input
              id='sku'
              name='sku'
              value={formData.sku}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='categoryId'>
              {/* {t('Product.category')} */}
              Danh mục
            </Label>
            <Input
              id='categoryId'
              name='categoryId'
              value={formData.categoryId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='unitId'>
              {/* {t('Product.unit')} */}
              Đơn vị đo lường
            </Label>
            <Input
              id='unitId'
              name='unitId'
              value={formData.unitId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor='brandId'>
              {/* {t('Product.brand')} */}
              Hãng
            </Label>
            <Input
              id='brandId'
              name='brandId'
              value={formData.brandId}
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

export default AddProductDialog;
