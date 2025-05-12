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
            <DialogTitle className='text-2xl font-bold text-gray-800'>
              Chi tiết tồn kho
            </DialogTitle>
          </DialogHeader>

          <div className='grid grid-cols-2 gap-6'>
            {/* Ô 1: Tồn kho */}
            <section className='rounded-2xl bg-gray-50 p-5 shadow-sm border border-gray-200 space-y-3'>
              <h3 className='text-lg font-semibold text-[#1E3A8A]'>
                Thông tin tồn kho
              </h3>
              <div className='space-y-2 text-sm text-gray-700'>
                <p>
                  <span className='text-gray-500'>Hiện có:</span>{' '}
                  {currentQuantity}
                </p>
                <p>
                  <span className='text-gray-500'>Đã sắp xếp:</span>{' '}
                  {arrangedQuantity ?? 'Chưa có thông tin'}
                </p>
                <p>
                  <span className='text-gray-500'>Chưa sắp xếp:</span>{' '}
                  {notArrgangedQuantity ?? 'Chưa có thông tin'}
                </p>
              </div>
            </section>

            {/* Ô 2: Sản phẩm */}
            <section className='rounded-2xl bg-gray-50 p-5 shadow-sm border border-gray-200 space-y-3'>
              <h3 className='text-lg font-semibold text-[#1E3A8A]'>
                Thông tin sản phẩm
              </h3>
              <div className='space-y-2 text-sm text-gray-700'>
                <p>
                  <span className='text-gray-500'>Tên:</span>{' '}
                  {batch.product?.name}
                </p>
                <p>
                  <span className='text-gray-500'>SKU:</span>{' '}
                  {batch.product?.sku}
                </p>
                <p>
                  <span className='text-gray-500'>Thương hiệu:</span>{' '}
                  {batch.product?.brandName}
                </p>
                <p>
                  <span className='text-gray-500'>Đơn vị:</span>{' '}
                  {batch.product?.unitName}
                </p>
              </div>
            </section>

            {/* Ô 3: Lô */}
            <section className='rounded-2xl bg-gray-50 p-5 shadow-sm border border-gray-200 space-y-3'>
              <h3 className='text-lg font-semibold text-[#1E3A8A]'>
                Thông tin lô
              </h3>
              <div className='space-y-2 text-sm text-gray-700'>
                <p>
                  <span className='text-gray-500'>Mã lô:</span> {batch.code}
                </p>
                <p>
                  <span className='text-gray-500'>Tên:</span> {batch.name}
                </p>
                <p>
                  <span className='text-gray-500'>NSX:</span> {batch.mfgDate}
                </p>
                <p>
                  <span className='text-gray-500'>HSD:</span> {batch.expDate}
                </p>
                <p>
                  <span className='text-gray-500'>Ngày nhập kho:</span>{' '}
                  {batch.inboundDate}
                </p>
                <p>
                  <span className='text-gray-500'>Ngày tạo:</span>{' '}
                  {formatDate(batch.createdTime)}
                </p>
              </div>
            </section>

            {/* Ô 4: Kho */}
            <section className='rounded-2xl bg-gray-50 p-5 shadow-sm border border-gray-200 space-y-3'>
              <h3 className='text-lg font-semibold text-[#1E3A8A]'>
                Thông tin kho
              </h3>
              <div className='space-y-2 text-sm text-gray-700'>
                <p>
                  <span className='text-gray-500'>Tên:</span> {warehouse.name}
                </p>
                <p>
                  <span className='text-gray-500'>Điện thoại:</span>{' '}
                  {warehouse.phone ?? 'Không có'}
                </p>
                <p>
                  <span className='text-gray-500'>Địa chỉ:</span>{' '}
                  {warehouse.address}
                </p>
                <p>
                  <span className='text-gray-500'>Diện tích:</span>{' '}
                  {warehouse.area} m²
                </p>
                <p>
                  <span className='text-gray-500'>Bắt đầu hoạt động:</span>{' '}
                  {formatDate(warehouse.operateFrom)}
                </p>
              </div>
            </section>

            {/* Ô dài cuối: Thông tin tạo */}
            <section className='col-span-2 rounded-2xl bg-gray-50 p-5 shadow-sm border border-gray-200'>
              <h3 className='text-lg font-semibold text-[#1E3A8A] mb-3'>
                Thông tin tạo
              </h3>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-11 w-11'>
                    <AvatarImage src={inventory.createdByAvatarUrl} />
                    <AvatarFallback>
                      {inventory.createdByFullName?.[0] ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-medium text-gray-800'>
                      {inventory.createdByFullName ?? 'Không rõ'}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {inventory.createdByGroup ?? 'Không có'}
                    </p>
                  </div>
                </div>
                <div className='text-sm text-gray-700'>
                  <p className='text-gray-500'>Ngày tạo</p>
                  <p className='font-medium'>
                    {formatDate(inventory.createdTime)}
                  </p>
                </div>
              </div>
            </section>
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
