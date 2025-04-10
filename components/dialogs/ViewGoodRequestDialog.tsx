'use client';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { Eye } from 'lucide-react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { GoodRequest } from '@/types/goodRequest';
import { Button } from '../shadcn-base/Button';
import { useRef } from 'react';
import Image from 'next/image';
import { useReactToPrint } from 'react-to-print';

interface GoodRequestDialogProps {
  goodRequest: GoodRequest;
}

export type GoodRequestDetail = {
  productId?: string;
  productName?: string;
  quantity?: string;
};

export function ViewGoodRequestDialog({ goodRequest }: GoodRequestDialogProps) {
  const contentRef = useRef(null);

  // Function to handle printing/exporting to PDF
  const handlePrint = useReactToPrint({
    contentRef,
  });

  // Determine request type
  const isImportRequest = goodRequest.requestType === 0; // Nhập Kho
  const isExportRequest = goodRequest.requestType === 1; // Xuất Kho
  const isInternalExportRequest = goodRequest.requestType === 2; // Xuất Nội Bộ

  // Set the title and no-note message based on request type
  const requestTitle = isImportRequest
    ? 'YÊU CẦU NHẬP KHO'
    : isExportRequest
    ? 'YÊU CẦU XUẤT KHO'
    : 'YÊU CẦU XUẤT NỘI BỘ';
  const noNoteMessage = isImportRequest
    ? 'Chưa lập phiếu nhập'
    : 'Chưa lập phiếu xuất';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Eye className='text-blue-500' size={20} />
      </DialogTrigger>
      <DialogContent className='max-w-4xl max-h-screen overflow-auto'>
        <DialogTitle />
        <DialogDescription />

        {/* Good Request Section */}
        <div className='p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Chi tiết yêu cầu - {requestTitle}
          </h2>
          <div className='mb-4'>
            <p>
              <strong>Số yêu cầu:</strong> {goodRequest.code || 'N/A'}
            </p>
            {isInternalExportRequest ? (
              <>
                <p>
                  <strong>Kho xuất:</strong>{' '}
                  {goodRequest.requestedWarehouseName || 'N/A'}
                </p>
                <p>
                  <strong>Kho nhận:</strong>{' '}
                  {goodRequest.warehouseName || 'N/A'}
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>
                    {isImportRequest ? 'Nhà cung cấp:' : 'Người nhận:'}
                  </strong>{' '}
                  {isImportRequest ? goodRequest.partnerName || 'N/A' : ''}
                </p>
                <p>
                  <strong>Kho nhận yêu cầu:</strong>{' '}
                  {goodRequest.requestedWarehouseName}
                </p>
              </>
            )}
          </div>

          {/* Good Request Table */}
          <table className='w-full border-collapse bg-white shadow-sm rounded-lg'>
            <thead>
              <tr className='bg-gray-100 text-left text-gray-700'>
                <th className='p-3 font-semibold border-b'>STT</th>
                <th className='p-3 font-semibold border-b'>Mã sản phẩm</th>
                <th className='p-3 font-semibold border-b'>Tên sản phẩm</th>
                <th className='p-3 font-semibold border-b'>Hãng</th>
                <th className='p-3 font-semibold border-b'>ĐVT</th>
                <th className='p-3 font-semibold border-b'>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {goodRequest.goodRequestDetails?.map((detail, index) => (
                <tr key={index} className='hover:bg-gray-50'>
                  <td className='p-3 border-b'>{index + 1}</td>
                  <td className='p-3 border-b'>{detail.sku || 'N/A'}</td>
                  <td className='p-3 border-b'>
                    {detail.productName || 'N/A'}
                  </td>
                  <td className='p-3 border-b'>{detail.brandName || 'N/A'}</td>
                  <td className='p-3 border-b'>{detail.unitName || 'N/A'}</td>
                  <td className='p-3 border-b'>{detail.quantity || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Good Note Section (if exists) */}
        {goodRequest.goodNote ? (
          <div
            ref={contentRef}
            className='p-24 border-t border-gray-200 mt-6'
            style={{ fontFamily: 'Times New Roman' }}
          >
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
                  {goodRequest.goodNote.code || 'N/A'}
                </p>
                <p>
                  <strong className='font-normal'>Ngày:</strong>{' '}
                  {new Date(goodRequest.goodNote.date || '').toLocaleDateString(
                    'vi-VN'
                  )}
                </p>
              </div>
            </div>

            <div>
              {/* Title */}
              <div className='text-center text-xl font-bold mt-20 text-[#2F5597]'>
                {requestTitle.replace('YÊU CẦU', 'PHIẾU')}
              </div>

              {/* Info Section */}
              <div className='mt-4'>
                {isInternalExportRequest ? (
                  <>
                    <p>
                      <strong className='font-normal'>Kho xuất:</strong>{' '}
                      {goodRequest.requestedWarehouse?.name || 'N/A'}
                    </p>
                    <p>
                      <strong className='font-normal'>Địa chỉ:</strong>{' '}
                      {goodRequest.requestedWarehouse?.address || 'N/A'}
                    </p>
                    <p>
                      <strong className='font-normal'>SĐT:</strong>{' '}
                      {goodRequest.requestedWarehouse?.phone || 'N/A'}
                    </p>
                    <p className='mt-2'>
                      <strong className='font-normal'>Kho nhận:</strong>{' '}
                      {goodRequest.warehouse?.name || 'N/A'}
                    </p>
                    <p>
                      <strong className='font-normal'>Địa chỉ:</strong>{' '}
                      {goodRequest.warehouse?.address || 'N/A'}
                    </p>
                    <p>
                      <strong className='font-normal'>SĐT:</strong>{' '}
                      {goodRequest.warehouse?.phone || 'N/A'}
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong className='font-normal'>
                        {isImportRequest ? 'Nhà cung cấp:' : ''}
                      </strong>{' '}
                      {isImportRequest
                        ? goodRequest.partner?.name || 'N/A'
                        : ''}
                    </p>
                    <p>
                      <strong className='font-normal'>Địa chỉ:</strong>{' '}
                      {goodRequest.requestedWarehouse?.address || 'N/A'}
                    </p>
                    <p>
                      <strong className='font-normal'>SĐT:</strong>{' '}
                      {goodRequest.requestedWarehouse?.phone || 'N/A'}
                    </p>
                  </>
                )}
              </div>

              {/* Good Note Table */}
              <table className='w-full mt-4 border border-black'>
                <thead>
                  <tr className='text-left font-normal'>
                    <th className='border-r border-black p-2 font-normal'>
                      STT
                    </th>
                    <th className='border-r border-black p-2 font-normal'>
                      Mã hàng
                    </th>
                    <th className='border-r border-black p-2 font-normal'>
                      Tên hàng
                    </th>
                    <th className='border-r border-black p-2 font-normal'>
                      ĐVT
                    </th>
                    <th className='border-r border-black p-2 font-normal'>
                      Số lượng
                    </th>
                    <th className='p-2 font-normal'>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {goodRequest.goodNote.goodNoteDetails?.map(
                    (detail, index) => (
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
                    )
                  )}
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
                      {isInternalExportRequest ? 'THỦ KHO XUẤT' : 'THỦ KHO'}
                    </strong>
                  </p>
                  <p>(Ký, họ tên)</p>
                </div>
                <div className='text-center w-1/2'>
                  <p>
                    <strong>
                      {isImportRequest
                        ? 'NGƯỜI GIAO HÀNG'
                        : isExportRequest
                        ? 'NGƯỜI NHẬN HÀNG'
                        : 'THỦ KHO NHẬN'}
                    </strong>
                  </p>
                  <p>(Ký, họ tên)</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center p-6'>
            <p className='text-lg text-gray-600'>{noNoteMessage}</p>
          </div>
        )}

        {/* Buttons */}
        <div className='flex space-x-4 mt-4 px-6'>
          {goodRequest.goodNote ? (
            <>
              <Button className='w-full' onClick={() => handlePrint()}>
                In phiếu
              </Button>
            </>
          ) : (
            <Button className='w-full' disabled>
              {noNoteMessage}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
