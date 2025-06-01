/* eslint-disable @next/next/no-img-element */
'use client';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/shadcn-base/Dialog';
import { useProducts } from '@/hooks/queries/productQueries';
import { useWarehouseById } from '@/hooks/queries/warehouseQueries';
import { InventoryCount } from '@/types/inventoryCount';
import { Product } from '@/types/product';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Eye, Loader2 } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '../shadcn-base/Button';

interface ViewInventoryCountDialogProps {
  inventoryCount: InventoryCount;
}

export function ViewInventoryCountDialog({
  inventoryCount,
}: ViewInventoryCountDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Fetch warehouse information
  const { data: warehouse } = useWarehouseById(
    inventoryCount.warehouseId || ''
  );

  // Fetch all products
  const { data: products, isLoading: isLoadingProducts } = useProducts();

  // Create products map for quick lookup
  const productsMap = useMemo(() => {
    if (!products) return new Map<string, Product>();
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  // Function to handle printing
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `InventoryCount_${inventoryCount.code}`,
  });

  if (isLoadingProducts) {
    return (
      <div className='flex items-center justify-center'>
        <Loader2 className='h-4 w-4 animate-spin' />
      </div>
    );
  }

  // Check if user has permission to print (status !== 3)
  const canPrint = !currentUser?.groups?.some((group) => group.id === '3');

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
              Phiếu Kiểm Kho
            </h2>
            <div className='text-sm text-gray-600'>
              <p>
                <strong>Số phiếu:</strong> {inventoryCount.code}
              </p>
              <p>
                <strong>Ngày:</strong>{' '}
                {new Date(inventoryCount.date || '').toLocaleDateString(
                  'vi-VN'
                )}
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className='bg-gray-50 p-4 rounded-lg mb-6'>
            <div>
              <h3 className='text-lg font-medium text-gray-700 mb-2'>
                {warehouse?.name}
              </h3>
              <p>
                <strong>Địa chỉ kho:</strong> {warehouse?.address || '-'}
              </p>
              <p>
                <strong>SĐT:</strong> {warehouse?.phone || '-'}
              </p>
              <p>
                <strong>Ghi chú:</strong> {inventoryCount.note || '-'}
              </p>
              <div className='grid grid-cols-2 gap-4 mt-2'>
                <p>
                  <strong>Giờ bắt đầu:</strong>{' '}
                  {inventoryCount.startTime || '-'}
                </p>
                <p>
                  <strong>Giờ kết thúc:</strong> {inventoryCount.endTime || '-'}
                </p>
              </div>
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
                    Mã lô
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    ĐVT
                  </th>
                  <th className='border border-gray-200 p-2 text-right text-gray-700'>
                    SL dự kiến
                  </th>
                  <th className='border border-gray-200 p-2 text-right text-gray-700'>
                    SL đếm
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    Nhân viên
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventoryCount.inventoryCountDetails?.length ? (
                  inventoryCount.inventoryCountDetails.map((detail, index) => {
                    const product = productsMap.get(detail.productId || '');
                    return (
                      <tr key={index} className='hover:bg-gray-50'>
                        <td className='border border-gray-200 p-2'>
                          {index + 1}
                        </td>
                        <td className='border border-gray-200 p-2'>
                          {product?.sku || detail.productSku || '-'}
                        </td>
                        <td className='border border-gray-200 p-2'>
                          {product?.name || detail.productName || '-'}
                        </td>
                        <td className='border border-gray-200 p-2'>
                          {detail.batchCode || '-'}
                        </td>
                        <td className='border border-gray-200 p-2'>
                          {product?.unitName || '-'}
                        </td>
                        <td className='border border-gray-200 p-2 text-right'>
                          {detail.expectedQuantity || 0}
                        </td>
                        <td className='border border-gray-200 p-2 text-right'>
                          {detail.countedQuantity || 0}
                        </td>
                        <td className='border border-gray-200 p-2'>
                          {detail.createdByFullName || '-'}
                        </td>
                        <td className='border border-gray-200 p-2'>
                          {detail.note || ''}
                        </td>
                      </tr>
                    );
                  })
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

          {/* Action Button - Only show if user has permission */}
          {canPrint && (
            <Button
              onClick={() => handlePrint()}
              className='w-full mt-6 bg-blue-500 hover:bg-blue-600'
            >
              In phiếu
            </Button>
          )}
        </div>

        {/* Hidden Print Layout - Only include if user has permission */}
        {canPrint && (
          <div className='hidden print:block' ref={contentRef}>
            <div className='p-24' style={{ fontFamily: 'Times New Roman' }}>
              <div className='flex justify-between'>
                <div className='w-1/2'>
                  <img
                    src='https://res.cloudinary.com/ddietgxw8/image/upload/v1748681691/TNTProjects_sfdj52.svg'
                    alt='Company Logo'
                    width={1080}
                    height={1080}
                    className='w-[45%] h-auto'
                  />
                </div>
                <div className='text-right'>
                  <p>
                    <strong className='font-normal'>Số phiếu:</strong>{' '}
                    {inventoryCount.code}
                  </p>
                  <p>
                    <strong className='font-normal'>Ngày:</strong>{' '}
                    {new Date(inventoryCount.date || '').toLocaleDateString(
                      'vi-VN'
                    )}
                  </p>
                </div>
              </div>

              <div className='text-center text-xl font-bold mt-20 text-[#2F5597]'>
                PHIẾU KIỂM KHO
              </div>

              <div className='mt-4'>
                <p>
                  <strong className='font-normal'>Kho:</strong>{' '}
                  {warehouse?.name}
                </p>
                <p>
                  <strong className='font-normal'>Địa chỉ:</strong>{' '}
                  {warehouse?.address}
                </p>
                <p>
                  <strong className='font-normal'>SĐT:</strong>{' '}
                  {warehouse?.phone}
                </p>
                <p>
                  <strong className='font-normal'>Ghi chú:</strong>{' '}
                  {inventoryCount.note}
                </p>
                <div className='grid grid-cols-2 gap-4 mt-2'>
                  <p>
                    <strong className='font-normal'>Giờ bắt đầu:</strong>{' '}
                    {inventoryCount.startTime}
                  </p>
                  <p>
                    <strong className='font-normal'>Giờ kết thúc:</strong>{' '}
                    {inventoryCount.endTime}
                  </p>
                </div>
              </div>

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
                      Mã lô
                    </th>
                    <th className='border-r border-black p-2 font-normal'>
                      ĐVT
                    </th>
                    <th className='border-r border-black p-2 font-normal'>
                      SL dự kiến
                    </th>
                    <th className='border-r border-black p-2 font-normal'>
                      SL đếm
                    </th>
                    <th className='border-r border-black p-2 font-normal'>
                      Nhân viên
                    </th>
                    <th className='p-2 font-normal'>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryCount.inventoryCountDetails?.map(
                    (detail, index) => {
                      const product = productsMap.get(detail.productId || '');
                      return (
                        <tr key={index}>
                          <td className='border-r border-t border-black p-2'>
                            {index + 1}
                          </td>
                          <td className='border-r border-t border-black p-2'>
                            {product?.sku || '-'}
                          </td>
                          <td className='border-r border-t border-black p-2'>
                            {product?.name || detail.productName || '-'}
                          </td>
                          <td className='border-r border-t border-black p-2'>
                            {detail.batchCode || '-'}
                          </td>
                          <td className='border-r border-t border-black p-2'>
                            {product?.unitName || '-'}
                          </td>
                          <td className='border-r border-t border-black p-2 text-right'>
                            {detail.expectedQuantity || 0}
                          </td>
                          <td className='border-r border-t border-black p-2 text-right'>
                            {detail.countedQuantity || 0}
                          </td>
                          <td className='border-r border-t border-black p-2'>
                            {detail.createdByFullName || '-'}
                          </td>
                          <td className='border-t border-black p-2'>
                            {detail.note || ''}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>

              <div className='flex justify-end mt-10 mr-6'>
                <div>Ngày...Tháng...Năm...</div>
              </div>
              <div className='flex justify-between mt-2'>
                <div className='text-center w-1/2'>
                  <p>
                    <strong>NGƯỜI KIỂM KHO</strong>
                  </p>
                  <p>(Ký, họ tên)</p>
                </div>
                <div className='text-center w-1/2'>
                  <p>
                    <strong>THỦ KHO</strong>
                  </p>
                  <p>(Ký, họ tên)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
