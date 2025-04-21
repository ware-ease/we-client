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
import { Label } from '@/components/shadcn-base/Label';
import { Product } from '@/types/product';
import { Eye } from 'lucide-react';
import React from 'react';

type ViewProductDialogProps = {
  product: Product;
};

const ViewProductDialog: React.FC<ViewProductDialogProps> = ({ product }) => {
  return (
    <div className='flex justify-end'>
      <Dialog>
        <DialogTrigger asChild>
          <Eye className='text-blue-600 h-5 w-5 hover:cursor-pointer' />
        </DialogTrigger>
        <DialogContent
          className='flex flex-col w-full max-w-3xl p-6 m-4 bg-white rounded-2xl shadow-xl border border-gray-200'
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <DialogHeader>
            <DialogTitle className='text-2xl font-semibold text-gray-800'>
              Chi tiết sản phẩm
            </DialogTitle>
          </DialogHeader>

          <div className='mt-4 space-y-6 text-sm text-gray-800'>
            {/* --- THÔNG TIN CHUNG --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin chung
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm text-gray-500'>SKU</Label>
                  <p>{product.sku || '—'}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Tên sản phẩm</Label>
                  <p>{product.name || '—'}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Đơn vị</Label>
                  <p>{product.unitName || product.unit || '—'}</p>
                </div>
                {/* <div>
                  <Label className='text-sm text-gray-500'>Trạng thái</Label>
                  <p>{product.status ? 'Đang hoạt động' : 'Ngưng sử dụng'}</p>
                </div> */}
              </div>
            </div>

            {/* --- PHÂN LOẠI --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Phân loại
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm text-gray-500'>Loại sản phẩm</Label>
                  <p>{(product.productType as string) || '—'}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Danh mục</Label>
                  <p>{product.category || '—'}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Thương hiệu</Label>
                  <p>{product.brandName || product.brand || '—'}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>
                    Quản lý theo lô
                  </Label>
                  <p>{product.isBatchManaged ? 'Có' : 'Không'}</p>
                </div>
              </div>
            </div>

            {/* --- GHI CHÚ --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Ghi chú
              </h3>
              <div className='bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[48px]'>
                <p>{product.note || 'Không có ghi chú'}</p>
              </div>
            </div>
          </div>

          <DialogFooter className='mt-6 flex justify-end'>
            <DialogClose asChild>
              <Button
                variant='secondary'
                className='px-4 py-2 hover:bg-slate-200'
              >
                Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewProductDialog;
