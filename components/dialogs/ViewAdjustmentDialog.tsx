/* eslint-disable @next/next/no-img-element */
'use client';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { useRef } from 'react';
import { Eye } from 'lucide-react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '../shadcn-base/Button';
import { useReactToPrint } from 'react-to-print';
import { InventoryAdjustment } from '@/types/warehouse';

interface ViewAdjustmentDialogProps {
  adjustment: InventoryAdjustment;
}

export function ViewAdjustmentDialog({
  adjustment,
}: ViewAdjustmentDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Function to handle printing
  const handlePrint = useReactToPrint({
    contentRef,
    // documentTitle: `Adjustment_${adjustment.code}`,
  });

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
              Phiếu Điều Chỉnh Tồn Kho
            </h2>
            <div className='text-sm text-gray-600'>
              <p>
                <strong>Số phiếu:</strong> {adjustment.code}
              </p>
              <p>
                <strong>Ngày:</strong>{' '}
                {new Date(adjustment.date || '').toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className='bg-gray-50 p-4 rounded-lg mb-6'>
            <div>
              <h3 className='text-lg font-medium text-gray-700 mb-2'>
                Thông tin điều chỉnh
              </h3>
              <p>
                <strong>Kho:</strong> {adjustment.warehouseName}
              </p>
              <p>
                <strong>Lý do:</strong> {adjustment.reason || 'N/A'}
              </p>
              <p>
                <strong>Ghi chú:</strong> {adjustment.note || 'N/A'}
              </p>
              <p>
                <strong>Chứng từ liên quan:</strong>{' '}
                {adjustment.relatedDocument || 'N/A'}
              </p>
            </div>
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
                    Tồn kho gốc
                  </th>
                  <th className='border border-gray-200 p-2 text-right text-gray-700'>
                    Số lượng điều chỉnh
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    Lô
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    Hạn sử dụng
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody>
                {adjustment.inventoryAdjustmentDetails?.length ? (
                  adjustment.inventoryAdjustmentDetails.map((detail, index) => (
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
                        {detail.batch?.product?.unit || 'N/A'}
                      </td>
                      <td className='border border-gray-200 p-2 text-right'>
                        {detail.newQuantity ||
                          0 - (detail.changeInQuantity || 0)}
                      </td>
                      <td className='border border-gray-200 p-2 text-right'>
                        {detail.changeInQuantity}
                      </td>
                      <td className='border border-gray-200 p-2'>
                        {detail.batch?.code || 'N/A'}
                      </td>
                      <td className='border border-gray-200 p-2'>
                        {detail.batch?.expDate.startsWith('0001-01-01')
                          ? 'Không có'
                          : new Date(
                              detail.batch?.expDate || ''
                            ).toLocaleDateString('vi-VN')}
                      </td>
                      <td className='border border-gray-200 p-2'>
                        {detail.note || ''}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
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
                <img
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
                  {adjustment.code}
                </p>
                <p>
                  <strong className='font-normal'>Ngày:</strong>{' '}
                  {new Date(adjustment.date || '').toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            <div className='text-center text-xl font-bold mt-20 text-[#2F5597]'>
              Phiếu Điều Chỉnh Tồn Kho
            </div>

            <div className='mt-4'>
              <p>
                <strong className='font-normal'>Kho:</strong>{' '}
                {adjustment.warehouseName}
              </p>
              <p>
                <strong className='font-normal'>Lý do:</strong>{' '}
                {adjustment.reason || 'N/A'}
              </p>
              <p>
                <strong className='font-normal'>Ghi chú:</strong>{' '}
                {adjustment.note || 'N/A'}
              </p>
              <p>
                <strong className='font-normal'>Chứng từ liên quan:</strong>{' '}
                {adjustment.relatedDocument || 'N/A'}
              </p>
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
                    Tồn kho gốc
                  </th>
                  <th className='border-r border-black p-2 font-normal'>
                    Số lượng điều chỉnh
                  </th>
                  <th className='border-r border-black p-2 font-normal'>Lô</th>
                  <th className='border-r border-black p-2 font-normal'>
                    Hạn sử dụng
                  </th>
                  <th className='p-2 font-normal'>Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {adjustment.inventoryAdjustmentDetails?.map((detail, index) => (
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
                      {detail.batch?.product?.unit || 'N/A'}
                    </td>
                    <td className='border-r border-t border-black p-2'>
                      {detail.newQuantity || 0 - (detail.changeInQuantity || 0)}
                    </td>
                    <td className='border-r border-t border-black p-2'>
                      {detail.changeInQuantity}
                    </td>
                    <td className='border-r border-t border-black p-2'>
                      {detail.batch?.code || 'N/A'}
                    </td>
                    <td className='border-r border-t border-black p-2'>
                      {detail.batch?.expDate.startsWith('0001-01-01')
                        ? 'N/A'
                        : new Date(
                            detail.batch?.expDate || ''
                          ).toLocaleDateString('vi-VN')}
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
                  <strong>THỦ KHO</strong>
                </p>
                <p>(Ký, họ tên)</p>
              </div>
              <div className='text-center w-1/2'>
                <p>
                  <strong>NGƯỜI LẬP PHIẾU</strong>
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
