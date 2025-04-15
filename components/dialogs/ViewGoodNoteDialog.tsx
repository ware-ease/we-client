'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { useRef } from 'react';
import { GoodNote } from '@/types/goodNote';
import { Eye } from 'lucide-react';
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

  // Determine note type based on noteType property
  const isImportNote = goodNote.noteType === 0; // Nhập Kho
  const isExportNote = goodNote.noteType === 1; // Xuất Kho
  const isInternalExportNote = goodNote.noteType === 2; // Xuất Nội Bộ

  // Set the title based on note type
  const noteTitle = isImportNote
    ? 'PHIẾU NHẬP KHO'
    : isExportNote
    ? 'PHIẾU XUẤT KHO'
    : 'PHIẾU XUẤT NỘI BỘ';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Eye className='text-blue-500' size={20} />
      </DialogTrigger>
      <DialogContent className={`max-w-3xl max-h-screen overflow-auto`}>
        <DialogTitle />
        <DialogDescription />
        <div
          ref={contentRef}
          className='p-24'
          style={{ fontFamily: 'Times New Roman' }}
        >
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

          <div>
            {/* Title */}
            <div className='text-center text-xl font-bold mt-20 text-[#2F5597]'>
              {noteTitle}
            </div>

            {/* Info Section */}
            <div className='mt-4'>
              {isInternalExportNote ? (
                <>
                  {/* Source Warehouse */}
                  <p>
                    <strong className='font-normal'>Kho xuất:</strong>{' '}
                    {goodNote.goodRequest?.requestedWarehouse?.name}
                  </p>
                  <p>
                    <strong className='font-normal'>Địa chỉ:</strong>{' '}
                    {goodNote.goodRequest?.requestedWarehouse?.address}
                  </p>
                  <p>
                    <strong className='font-normal'>SĐT:</strong>{' '}
                    {goodNote.goodRequest?.partner?.phone}
                  </p>
                  {/* Destination Warehouse */}
                  <p className='mt-2'>
                    <strong className='font-normal'>Kho nhận:</strong>{' '}
                    {goodNote.goodRequest?.warehouse?.name}
                  </p>
                  <p>
                    <strong className='font-normal'>Địa chỉ:</strong>{' '}
                    {goodNote.goodRequest?.warehouse?.address}
                  </p>
                  <p>
                    <strong className='font-normal'>SĐT:</strong>{' '}
                    {goodNote.goodRequest?.requestedWarehouse?.phone}
                  </p>
                </>
              ) : (
                <>
                  {/* Supplier or Recipient */}
                  <p>
                    <strong className='font-normal'>
                      {isImportNote ? 'Nhà cung cấp:' : 'Người nhận hàng:'}
                    </strong>{' '}
                    {isImportNote
                      ? goodNote.shipperName
                      : goodNote.receiverName || 'N/A'}
                  </p>
                  <p>
                    <strong className='font-normal'>Địa chỉ:</strong>{' '}
                    {goodNote.goodRequest?.requestedWarehouse?.address}
                  </p>
                  <p>
                    <strong className='font-normal'>SĐT:</strong>{' '}
                    {goodNote.goodRequest?.requestedWarehouse?.phone}
                  </p>
                </>
              )}
            </div>

            {/* Table */}
            <table className='w-full mt-4 border border-black'>
              <thead>
                <tr className='text-left font-normal'>
                  <th className='border-r border-black p-2 font-normal'>STT</th>
                  <th className='border-r border-black p-2 font-normal'>
                    Mã hàng
                  </th>
                  <th className='border-r border-black p-2 font-normal'>
                    Tên hàng
                  </th>
                  <th className='border-r border-black p-2 font-normal'>ĐVT</th>
                  <th className='border-r border-black p-2 font-normal'>
                    Số lượng
                  </th>
                  <th className='p-2 font-normal'>Ghi chú</th>
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
                      {detail.batch?.product?.name || 'N/A'}
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
                  <strong>
                    {isInternalExportNote ? 'THỦ KHO XUẤT' : 'THỦ KHO'}
                  </strong>
                </p>
                <p>(Ký, họ tên)</p>
              </div>
              <div className='text-center w-1/2'>
                <p>
                  <strong>
                    {isImportNote
                      ? 'NGƯỜI GIAO HÀNG'
                      : isExportNote
                      ? 'NGƯỜI NHẬN HÀNG'
                      : 'THỦ KHO NHẬN'}
                  </strong>
                </p>
                <p>(Ký, họ tên)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Print & Export Button */}
        <Button onClick={() => handlePrint()} className='w-full mt-4'>
          In phiếu
        </Button>
      </DialogContent>
    </Dialog>
  );
}
