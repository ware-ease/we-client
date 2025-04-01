'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { useRef } from 'react';
import { GoodNote } from '@/types/goodNote';
import { View } from 'lucide-react';
import Image from 'next/image';

interface GoodNoteDialogProps {
  goodNote: GoodNote;
}

export function ViewGoodNoteDialog({ goodNote }: GoodNoteDialogProps) {
  const printRef = useRef(null);

  // Function to handle printing/exporting to PDF
  // const handlePrint = useReactToPrint({
  //   content: () => printRef.current,
  // });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <View className='text-blue-500' size={20} />
        </button>
      </DialogTrigger>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>PHIẾU NHẬP KHO</DialogTitle>
        </DialogHeader>

        <div ref={printRef} className='p-6 border border-gray-300 bg-white'>
          {/* Header */}
          <div className='flex justify-between'>
            <div className='w-1/2'>
              <Image
                src='/TNTProjects.png'
                alt='Company Logo'
                width={120}
                height={120}
              />
            </div>
            <div className='text-right'>
              <p>
                <strong className='font-normal'>Số phiếu:</strong>{' '}
                {goodNote.code}
              </p>
              <p>
                <strong className='font-normal'>Ngày:</strong>{' '}
                {new Date(goodNote.date || '').toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          {/* Supplier Info */}
          <div className='mt-4'>
            <p>
              <strong className='font-normal'>Nhà cung cấp:</strong>{' '}
              {goodNote.shipperName || 'N/A'}
            </p>
            <p>
              <strong className='font-normal'>Địa chỉ:</strong> {goodNote.id}
            </p>
            <p>
              <strong className='font-normal'>SĐT:</strong> ___________
            </p>
          </div>

          {/* Table */}
          <table className='w-full mt-4 border border-gray-500'>
            <thead>
              <tr className='bg-gray-200 text-left'>
                <th className='border p-2'>STT</th>
                <th className='border p-2'>Mã hàng</th>
                <th className='border p-2'>Tên hàng</th>
                <th className='border p-2'>ĐVT</th>
                <th className='border p-2'>Số lượng</th>
                <th className='border p-2'>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {goodNote.goodNoteDetails?.map((detail, index) => (
                <tr key={index}>
                  <td className='border p-2'>{index + 1}</td>
                  <td className='border p-2'>
                    {detail.batch?.product?.sku || 'N/A'}
                  </td>
                  <td className='border p-2'>{detail.batch?.name || 'N/A'}</td>
                  <td className='border p-2'>
                    {detail.batch?.product?.unitName || 'N/A'}
                  </td>
                  <td className='border p-2'>{detail.quantity}</td>
                  <td className='border p-2'>{detail.note || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className='flex justify-between mt-6'>
            <div className='text-center w-1/2'>
              <p>
                <strong>THỦ KHO</strong>
              </p>
              <p>(Ký, họ tên)</p>
            </div>
            <div className='text-center w-1/2'>
              <p>
                <strong>NGƯỜI GIAO HÀNG</strong>
              </p>
              <p>(Ký, họ tên)</p>
            </div>
          </div>
        </div>

        {/* Print & Export Button */}
        {/* <Button onClick={handlePrint} className="w-full mt-4">Print / Export PDF</Button> */}
      </DialogContent>
    </Dialog>
  );
}
