'use client';
import { TranslatedMessage } from '@/components/app/TranslatedMessage';
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
import { useAddProduct } from '@/hooks/queries/productQueries';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import BrandComboBox from '../combo-boxes/BrandComboBox';
import ProductTypeComboBox from '../combo-boxes/ProductTypeComboBox';
import UnitComboBox from '../combo-boxes/UnitComboBox';
import { RadioGroup, RadioGroupItem } from '../shadcn-base/RadioGroup';

const AddProductDialog = () => {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    productTypeId: '',
    unitId: '',
    brandId: '',
    isBatchManaged: 'true',
  });

  const productCreateMutation = useAddProduct();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    productCreateMutation.mutate({
      name: formData.name,
      sku: formData.sku,
      imageUrl: '',
      productTypeId: formData.productTypeId,
      unitId: formData.unitId,
      brandId: formData.brandId,
    });
    setFormData({
      name: '',
      sku: '',
      productTypeId: '',
      unitId: '',
      brandId: '',
      isBatchManaged: 'true',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='px-4 py-2 rounded-lg'>
          <TranslatedMessage tKey='Management.create' />
        </Button>
      </DialogTrigger>

      <DialogContent
        className='flex flex-col w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl border border-gray-200'
        style={{ overflow: 'visible' }}
      >
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold text-gray-800'>
            Tạo sản phẩm mới
          </DialogTitle>
        </DialogHeader>

        <div className='mt-4 space-y-6 text-sm text-gray-800'>
          {/* --- THÔNG TIN SẢN PHẨM --- */}
          <div>
            <h3 className='text-base font-semibold text-gray-700 mb-2'>
              Thông tin sản phẩm
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='name' className='text-sm text-gray-500'>
                  Tên sản phẩm
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
                <Label htmlFor='sku' className='text-sm text-gray-500'>
                  SKU
                </Label>
                <Input
                  id='sku'
                  name='sku'
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  className='mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
                />
              </div>
              <div>
                <Label
                  htmlFor='productTypeId'
                  className='text-sm text-gray-500'
                >
                  Loại sản phẩm
                </Label>
                <div className='mt-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500'>
                  <ProductTypeComboBox
                    value={formData.productTypeId}
                    onChange={(value) =>
                      handleSelectChange(value, 'productTypeId')
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor='unitId' className='text-sm text-gray-500'>
                  Đơn vị
                </Label>
                <div className='mt-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500'>
                  <UnitComboBox
                    value={formData.unitId}
                    onChange={(value) => handleSelectChange(value, 'unitId')}
                  />
                </div>
              </div>
              <div className='relative z-10'>
                <Label className='text-sm text-gray-500'>Hãng</Label>
                <div className='mt-1 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 overflow-visible'>
                  <BrandComboBox
                    value={formData.brandId}
                    onChange={(value) => handleSelectChange(value, 'brandId')}
                  />
                </div>
              </div>
              <div className='relative z-10'>
                <Label className='text-sm text-gray-500'>Quản lý theo lô</Label>
                <div className='mt-4 overflow-visible'>
                  <RadioGroup
                    className='flex space-x-4 mt-1'
                    value={formData.isBatchManaged}
                    onValueChange={(value) =>
                      setFormData({ ...formData, isBatchManaged: value })
                    }
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='true' id='true' />
                      <Label htmlFor='isBatchManaged'>Có</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='false' id='false' />
                      <Label htmlFor='isBatchManaged'>Không</Label>
                    </div>
                  </RadioGroup>
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
            onClick={() => handleAdd()}
          >
            {t('Dialog.yes.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
