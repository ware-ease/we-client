'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { useRef } from 'react';
import { GoodNote } from '@/types/goodNote';
import { View } from 'lucide-react';
import Image from 'next/image';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '../shadcn-base/Button';
import { useReactToPrint } from 'react-to-print';

interface GoodNoteDialogProps {
  goodNote: GoodNote;
}

export function ViewGoodNoteDialog({ goodNote }: GoodNoteDialogProps) {
  const contentRef = useRef(null);

  // Function to handle printing/exporting to PDF
  const handlePrint = useReactToPrint({
    contentRef,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <View className='text-blue-500' size={20} />
        </button>
      </DialogTrigger>
      <DialogContent
        className={`max-w-3xl max-h-screen overflow-auto`}
        style={{ fontFamily: 'TimesNewRoman' }}
      >
        <DialogTitle />
        <DialogDescription />
        <div ref={contentRef} className='p-24'>
          <DialogHeader>
            <div className='flex justify-between'>
              <div className='w-1/2'>
                <Image
                  src='/TNTProjects.svg'
                  alt='Company Logo'
                  width={1080}
                  height={1080}
                  className='w-[45%] h-auto'
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
          </DialogHeader>

          <div className=''>
            {/* Title */}
            <div className='text-center text-xl font-bold mt-20 text-[#2F5597]'>
              PHIẾU NHẬP KHO
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
            <table className='w-full mt-4 border border-black'>
              <thead>
                <tr className='text-left'>
                  <th className='border-r border-black p-2'>STT</th>
                  <th className='border-r border-black p-2'>Mã hàng</th>
                  <th className='border-r border-black p-2'>Tên hàng</th>
                  <th className='border-r border-black p-2'>ĐVT</th>
                  <th className='border-r border-black p-2'>Số lượng</th>
                  <th className='p-2'>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {goodNote.goodNoteDetails?.map((detail, index) => (
                  <tr key={index}>
                    <td className='border-r border-t border-black p-2'>
                      {index + 1}
                    </td>
                    <td className='border-r border-t border-black p-2'>
                      {detail.batch?.product?.sku || 'N/A'}
                    </td>
                    <td className='border-r border-t border-black p-2'>
                      {detail.batch?.name || 'N/A'}
                    </td>
                    <td className='border-r border-t border-black p-2'>
                      {detail.batch?.product?.unitName || 'N/A'}
                    </td>
                    <td className='border-r border-t border-black p-2'>
                      {detail.quantity}
                    </td>
                    <td className='border-t border-black p-2'>
                      {detail.note || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className='flex justify-end mt-10 mr-6'>
              <div>Ngày...Tháng...Năm...</div>
            </div>
            <div className='flex justify-between mt-2'>
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
        </div>

        {/* Print & Export Button */}
        <Button onClick={() => handlePrint()} className='w-full mt-4'>
          Print / Export PDF
        </Button>
      </DialogContent>
    </Dialog>
  );
}
