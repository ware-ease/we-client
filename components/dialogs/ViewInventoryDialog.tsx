'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn-base/Avatar';
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
import { Inventory } from '@/types/warehouse';
import { Eye } from 'lucide-react';
import React from 'react';

type ViewInventoryDialogProps = {
  inventory: Inventory;
  //  {
  //   currentQuantity: number;
  //   arrangedQuantity: number | null;
  //   notArrgangedQuantity: number | null;
  //   warehouseId: string;
  //   warehouse: Warehouse;
  //   batchId: string;
  //   batch: Batch;
  //   id: string;
  //   createdBy: string | null;
  //   createdTime: string;
  //   createdByAvatarUrl: string | null;
  //   createdByFullName: string | null;
  //   createdByGroup: string | null;
  // };
};

const ViewInventoryDialog: React.FC<ViewInventoryDialogProps> = ({
  inventory,
}) => {
  const {
    currentQuantity,
    arrangedQuantity,
    notArrgangedQuantity,
    warehouse,
    batch,
  } = inventory;

  const formatDate = (dateStr?: string) => {
    return dateStr ? new Date(dateStr).toLocaleString('vi-VN') : 'Không có';
  };

  return (
    <div className='flex justify-end'>
      <Dialog>
        <DialogTrigger asChild>
          <Eye className='text-blue-500 h-5 w-5 hover:cursor-pointer' />
        </DialogTrigger>
        <DialogContent
          className='flex flex-col w-full max-w-3xl max-h-[80vh] overflow-y-auto p-6 m-4 bg-white rounded-2xl shadow-xl border border-gray-200'
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <DialogHeader>
            <DialogTitle className='text-2xl font-semibold text-gray-800'>
              Chi tiết tồn kho
            </DialogTitle>
          </DialogHeader>

          <div className='mt-4 space-y-6 text-sm text-gray-800'>
            {/* --- THÔNG TIN TỒN KHO --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin tồn kho
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm text-gray-500'>Hiện có</Label>
                  <p>{currentQuantity}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Đã sắp xếp</Label>
                  <p>{arrangedQuantity ?? 'Chưa có thông tin'}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Chưa sắp xếp</Label>
                  <p>{notArrgangedQuantity ?? 'Chưa có thông tin'}</p>
                </div>
              </div>
            </div>

            {/* --- THÔNG TIN SẢN PHẨM --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin sản phẩm
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm text-gray-500'>Tên</Label>
                  <p>{batch.product?.name}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>SKU</Label>
                  <p>{batch.product?.sku}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Thương hiệu</Label>
                  <p>{batch.product?.brandName}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Đơn vị</Label>
                  <p>{batch.product?.unitName}</p>
                </div>
              </div>
            </div>

            {/* --- THÔNG TIN LÔ --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin lô
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm text-gray-500'>Mã lô</Label>
                  <p>{batch.code}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Tên</Label>
                  <p>{batch.name}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>NSX</Label>
                  <p>{batch.mfgDate}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>HSD</Label>
                  <p>{batch.expDate}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Ngày nhập kho</Label>
                  <p>{batch.inboundDate}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Ngày tạo</Label>
                  <p>{formatDate(batch.createdTime)}</p>
                </div>
              </div>
            </div>

            {/* --- THÔNG TIN KHO --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin kho
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm text-gray-500'>Tên</Label>
                  <p>{warehouse.name}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Điện thoại</Label>
                  <p>{warehouse.phone ?? 'Không có'}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Địa chỉ</Label>
                  <p>{warehouse.address}</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Diện tích</Label>
                  <p>{warehouse.area} m²</p>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>
                    Bắt đầu hoạt động
                  </Label>
                  <p>{formatDate(warehouse.operateFrom)}</p>
                </div>
              </div>
            </div>

            {/* --- NGƯỜI TẠO & THỜI GIAN --- */}
            <div>
              <h3 className='text-base font-semibold text-gray-700 mb-2'>
                Thông tin tạo
              </h3>
              <div className='grid grid-cols-2 gap-4 items-center'>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={inventory.createdByAvatarUrl} />
                    <AvatarFallback>
                      {inventory.createdByFullName?.[0] ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium'>
                      {inventory.createdByFullName ?? 'Không rõ'}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {inventory.createdByGroup ?? 'Không có'}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className='text-sm text-gray-500'>Ngày tạo</Label>
                  <p>{formatDate(inventory.createdTime)}</p>
                </div>
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

export default ViewInventoryDialog;
