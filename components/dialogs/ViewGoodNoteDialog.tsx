'use client';
import {
  Dialog,
  DialogContent,
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
  const contentRef = useRef<HTMLDivElement>(null);

  // Function to handle printing
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `GoodNote_${goodNote.code}`,
  });

  // Determine note type
  const isImportNote = goodNote.noteType === 0; // Nhập Kho
  const isExportNote = goodNote.noteType === 1; // Xuất Kho
  const isInternalExportNote = goodNote.noteType === 2; // Xuất Nội Bộ

  // Set the title based on note type
  const noteTitle = isImportNote
    ? 'Phiếu Nhập Kho'
    : isExportNote
    ? 'Phiếu Xuất Kho'
    : 'Phiếu Xuất Nội Bộ';

  console.log(goodNote);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Eye
          className='text-blue-500 hover:text-blue-700 cursor-pointer'
          size={20}
        />
      </DialogTrigger>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-auto'>
        <DialogTitle />
        <DialogDescription />
        <div className='p-6'>
          {/* Header */}
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-semibold text-gray-800'>
              {noteTitle}
            </h2>
            <div className='text-sm text-gray-600'>
              <p>
                <strong>Số phiếu:</strong> {goodNote.code}
              </p>
              <p>
                <strong>Ngày:</strong>{' '}
                {new Date(goodNote.date || '').toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className='bg-gray-50 p-4 rounded-lg mb-6'>
            {isInternalExportNote ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Source Warehouse */}
                <div>
                  <h3 className='text-lg font-medium text-gray-700 mb-2'>
                    Kho xuất
                  </h3>
                  <p>
                    <strong>Tên:</strong>{' '}
                    {goodNote.goodRequest?.requestedWarehouse?.name || 'N/A'}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong>{' '}
                    {goodNote.goodRequest?.requestedWarehouse?.address || 'N/A'}
                  </p>
                  <p>
                    <strong>SĐT:</strong>{' '}
                    {goodNote.goodRequest?.partner?.phone || 'N/A'}
                  </p>
                </div>
                {/* Destination Warehouse */}
                <div>
                  <h3 className='text-lg font-medium text-gray-700 mb-2'>
                    Kho nhận
                  </h3>
                  <p>
                    <strong>Tên:</strong>{' '}
                    {goodNote.goodRequest?.warehouse?.name || 'N/A'}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong>{' '}
                    {goodNote.goodRequest?.warehouse?.address || 'N/A'}
                  </p>
                  <p>
                    <strong>SĐT:</strong>{' '}
                    {goodNote.goodRequest?.requestedWarehouse?.phone || 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className='text-lg font-medium text-gray-700 mb-2'>
                  {goodNote.goodRequest?.requestedWarehouse?.name}
                </h3>
                <p>
                  <strong>
                    {isImportNote ? 'Nhà cung cấp:' : 'Người nhận hàng'}
                  </strong>{' '}
                  {isImportNote
                    ? goodNote.shipperName
                    : goodNote.receiverName || 'N/A'}
                </p>
                <p>
                  <strong>Địa chỉ kho:</strong>{' '}
                  {goodNote.goodRequest?.requestedWarehouse?.address || 'N/A'}
                </p>
                <p>
                  <strong>SĐT:</strong>{' '}
                  {goodNote.goodRequest?.requestedWarehouse?.phone || 'N/A'}
                </p>
              </div>
            )}
          </div>

          {/* Table */}
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    STT
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    Mã hàng
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    Tên hàng
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    ĐVT
                  </th>
                  <th className='border border-gray-200 p-2 text-right text-gray-700'>
                    Số lượng
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody>
                {goodNote.goodNoteDetails?.length ? (
                  goodNote.goodNoteDetails.map((detail, index) => (
                    <tr key={index} className='hover:bg-gray-50'>
                      <td className='border border-gray-200 p-2'>
                        {index + 1}
                      </td>
                      <td className='border border-gray-200 p-2'>
                        {detail.batch?.product?.sku || 'N/A'}
                      </td>
                      <td className='border border-gray-200 p-2'>
                        {detail.batch?.product?.name || 'N/A'}
                      </td>
                      <td className='border border-gray-200 p-2'>
                        {detail.batch?.product?.unitName || 'N/A'}
                      </td>
                      <td className='border border-gray-200 p-2 text-right'>
                        {detail.quantity}
                      </td>
                      <td className='border border-gray-200 p-2'>
                        {detail.note || ''}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className='border border-gray-200 p-2 text-center text-gray-600'
                    >
                      Không có chi tiết
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => handlePrint()}
            className='w-full mt-6 bg-blue-500 hover:bg-blue-600'
          >
            In phiếu
          </Button>
        </div>

        {/* Hidden Print Layout */}
        <div className='hidden print:block' ref={contentRef}>
          <div className='p-24' style={{ fontFamily: 'Times New Roman' }}>
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

            <div className='text-center text-xl font-bold mt-20 text-[#2F5597]'>
              {noteTitle}
            </div>

            <div className='mt-4'>
              {isInternalExportNote ? (
                <>
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
                  <p>
                    <strong className='font-normal'>
                      {isImportNote ? 'Nhà cung cấp:' : 'Người nhận hàng:'}
                    </strong>{' '}
                    {isImportNote
                      ? goodNote.shipperName
                      : goodNote.receiverName || 'N/A'}
                  </p>
                  <p>
                    <strong className='font-normal'>
                      {isImportNote ? 'Kho nhập:' : 'Kho xuất:'}
                    </strong>{' '}
                    {goodNote.goodRequest?.requestedWarehouse?.name}
                  </p>
                  <p>
                    <strong className='font-normal'>Địa chỉ kho:</strong>{' '}
                    {goodNote.goodRequest?.requestedWarehouse?.address}
                  </p>
                  <p>
                    <strong className='font-normal'>SĐT:</strong>{' '}
                    {goodNote.goodRequest?.requestedWarehouse?.phone}
                  </p>
                </>
              )}
            </div>

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
      </DialogContent>
    </Dialog>
  );
}
