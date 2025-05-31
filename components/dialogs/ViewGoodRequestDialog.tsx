/* eslint-disable @next/next/no-img-element */
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
import { RefObject, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../shadcn-base/Carousel';

interface GoodRequestDialogProps {
  goodRequest: GoodRequest;
}

export type GoodRequestDetail = {
  productId?: string;
  productName?: string;
  quantity?: string;
};

export function ViewGoodRequestDialog({ goodRequest }: GoodRequestDialogProps) {
  const [open, setOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const contentRefs = useRef<RefObject<HTMLDivElement | null>[]>([]);
  const printRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on('select', () => {
      // Do something on select.
      setActiveSlideIndex(api.selectedScrollSnap());
      console.log(api.selectedScrollSnap());
    });
  }, [api]);

  // Initialize contentRefs
  useEffect(() => {
    const length = goodRequest.goodNotes?.length || 0;
    contentRefs.current = Array.from({ length }, () => ({
      current: null,
    }));
  }, [goodRequest.goodNotes]);

  // Sync printRef with active slide
  useEffect(() => {
    printRef.current =
      contentRefs.current[api?.selectedScrollSnap() || 0]?.current || null;
    console.log(api?.selectedScrollSnap());
  }, [api, activeSlideIndex]);

  // Handle printing for active slide
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  // Determine request type
  const isImportRequest = goodRequest.requestType === 0; // Nhập Kho
  const isExportRequest = goodRequest.requestType === 1; // Xuất Kho
  const isInternalExportRequest = goodRequest.requestType === 2; // Xuất Nội Bộ

  // Set the title and no-note message based on request type
  const requestTitle = isImportRequest
    ? 'Yêu cầu nhập kho'
    : isExportRequest
    ? 'Yêu cầu xuất kho'
    : 'Yêu cầu xuất nội bộ';
  const noNoteMessage = isImportRequest
    ? 'Chưa lập phiếu nhập'
    : 'Chưa lập phiếu xuất';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          {/* Good Request Section */}
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-semibold text-gray-800'>
              Chi tiết yêu cầu - {requestTitle}
            </h2>
            <div className='text-sm text-gray-600'>
              <p>
                <strong>Số yêu cầu:</strong> {goodRequest.code || 'N/A'}
              </p>
            </div>
          </div>
          <div className='bg-gray-50 p-4 rounded-lg mb-6'>
            {isInternalExportRequest ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <h3 className='text-lg font-medium text-gray-700 mb-2'>
                    Kho xuất
                  </h3>
                  <p>
                    <strong>Tên:</strong>{' '}
                    {goodRequest.requestedWarehouse?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 className='text-lg font-medium text-gray-700 mb-2'>
                    Kho nhận
                  </h3>
                  <p>
                    <strong>Tên:</strong> {goodRequest.warehouse?.name || 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className='text-lg font-medium text-gray-700 mb-2'>
                  {goodRequest.requestedWarehouse?.name || 'N/A'}
                </h3>
                <p>
                  <strong>
                    {isImportRequest ? 'Nhà cung cấp:' : 'Người nhận:'}
                  </strong>{' '}
                  {goodRequest.partner?.name}
                </p>
                <p>
                  <strong>Kho nhận yêu cầu:</strong>{' '}
                  {goodRequest.requestedWarehouse?.name || 'N/A'}
                </p>
              </div>
            )}
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    STT
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    Mã sản phẩm
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    Tên sản phẩm
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    Hãng
                  </th>
                  <th className='border border-gray-200 p-2 text-left text-gray-700'>
                    ĐVT
                  </th>
                  <th className='border border-gray-200 p-2 text-right text-gray-700'>
                    Số lượng
                  </th>
                </tr>
              </thead>
              <tbody>
                {goodRequest.goodRequestDetails?.length ? (
                  goodRequest.goodRequestDetails.map((detail, index) => (
                    <tr key={index} className='hover:bg-gray-50'>
                      <td className='border border-gray-200 p-2'>
                        {index + 1}
                      </td>
                      <td className='border border-gray-200 p-2'>
                        {detail.sku || 'N/A'}
                      </td>
                      <td className='border border-gray-200 p-2'>
                        {detail.productName || 'N/A'}
                      </td>
                      <td className='border border-gray-200 p-2'>
                        {detail.brandName || 'N/A'}
                      </td>
                      <td className='border border-gray-200 p-2'>
                        {detail.unitName || 'N/A'}
                      </td>
                      <td className='border border-gray-200 p-2 text-right'>
                        {detail.quantity || 'N/A'}
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

          {/* Good Note Section (Carousel) */}
          {goodRequest.goodNotes && goodRequest.goodNotes.length > 0 ? (
            <Carousel className='w-full max-w-xl mx-auto mt-6' setApi={setApi}>
              <CarouselContent>
                {goodRequest.goodNotes.map((goodNote, index) => (
                  <CarouselItem key={index}>
                    <div className='p-6'>
                      <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-2xl font-semibold text-gray-800'>
                          {!isInternalExportRequest
                            ? requestTitle.replace('Yêu cầu', 'Phiếu')
                            : goodNote.code?.startsWith('PNNB')
                            ? 'Phiếu Nhập Nội Bộ'
                            : 'Phiếu Xuất Nội Bộ'}
                        </h2>
                        <div className='text-sm text-gray-600'>
                          <p>
                            <strong>Số phiếu:</strong> {goodNote.code || 'N/A'}
                          </p>
                          <p>
                            <strong>Ngày:</strong>{' '}
                            {new Date(goodNote.date || '').toLocaleDateString(
                              'vi-VN'
                            )}
                          </p>
                        </div>
                      </div>
                      <div className='bg-gray-50 p-4 rounded-lg mb-6'>
                        {isInternalExportRequest ? (
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                              <h3 className='text-lg font-medium text-gray-700 mb-2'>
                                Kho xuất
                              </h3>
                              <p>
                                <strong>Tên:</strong>{' '}
                                {goodRequest.requestedWarehouse?.name || 'N/A'}
                              </p>
                              <p>
                                <strong>Địa chỉ:</strong>{' '}
                                {goodRequest.requestedWarehouse?.address ||
                                  'N/A'}
                              </p>
                              <p>
                                <strong>SĐT:</strong>{' '}
                                {goodRequest.requestedWarehouse?.phone || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <h3 className='text-lg font-medium text-gray-700 mb-2'>
                                Kho nhận
                              </h3>
                              <p>
                                <strong>Tên:</strong>{' '}
                                {goodRequest.warehouse?.name || 'N/A'}
                              </p>
                              <p>
                                <strong>Địa chỉ:</strong>{' '}
                                {goodRequest.warehouse?.address || 'N/A'}
                              </p>
                              <p>
                                <strong>SĐT:</strong>{' '}
                                {goodRequest.warehouse?.phone || 'N/A'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h3 className='text-lg font-medium text-gray-700 mb-2'>
                              {goodRequest.requestedWarehouse?.name || 'N/A'}
                            </h3>
                            <p>
                              <strong>
                                {isImportRequest
                                  ? 'Nhà cung cấp:'
                                  : 'Người nhận hàng'}
                              </strong>{' '}
                              {isImportRequest
                                ? goodRequest.partner?.name || 'N/A'
                                : ''}
                            </p>
                            <p>
                              <strong>Địa chỉ kho:</strong>{' '}
                              {goodRequest.requestedWarehouse?.address || 'N/A'}
                            </p>
                            <p>
                              <strong>SĐT:</strong>{' '}
                              {goodRequest.requestedWarehouse?.phone || 'N/A'}
                            </p>
                          </div>
                        )}
                      </div>
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
                      <Button
                        className='w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white'
                        onClick={() => handlePrint()}
                      >
                        In phiếu
                      </Button>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className='flex flex-col items-center p-6'>
              <p className='text-lg text-gray-600'>{noNoteMessage}</p>
            </div>
          )}

          {/* Hidden Print Layout */}
          {goodRequest.goodNotes && goodRequest.goodNotes.length > 0 && (
            <>
              {goodRequest.goodNotes.map((goodNote, index) => (
                <div
                  key={index}
                  className='hidden print:block'
                  ref={contentRefs.current[index]}
                >
                  <div
                    className='p-24'
                    style={{ fontFamily: 'Times New Roman' }}
                  >
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
                          {goodNote.code || 'N/A'}
                        </p>
                        <p>
                          <strong className='font-normal'>Ngày:</strong>{' '}
                          {new Date(goodNote.date || '').toLocaleDateString(
                            'vi-VN'
                          )}
                        </p>
                      </div>
                    </div>
                    <div className='text-center text-xl font-bold mt-20 text-[#2F5597]'>
                      {!isInternalExportRequest
                        ? requestTitle.replace('Yêu cầu', 'Phiếu')
                        : goodNote.code?.startsWith('PNNB')
                        ? 'Phiếu Nhập Nội Bộ'
                        : 'Phiếu Xuất Nội Bộ'}
                    </div>
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
                              {isImportRequest
                                ? 'Nhà cung cấp:'
                                : 'Người nhận hàng:'}
                            </strong>{' '}
                            {isImportRequest
                              ? goodRequest.partner?.name || 'N/A'
                              : ''}
                          </p>
                          <p>
                            <strong className='font-normal'>
                              {isImportRequest ? 'Kho nhập:' : 'Kho xuất:'}
                            </strong>{' '}
                            {goodRequest.requestedWarehouse?.name || 'N/A'}
                          </p>
                          <p>
                            <strong className='font-normal'>
                              Địa chỉ kho:
                            </strong>{' '}
                            {goodRequest.requestedWarehouse?.address || 'N/A'}
                          </p>
                          <p>
                            <strong className='font-normal'>SĐT:</strong>{' '}
                            {goodRequest.requestedWarehouse?.phone || 'N/A'}
                          </p>
                        </>
                      )}
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
                            ĐVT
                          </th>
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
                            {isInternalExportRequest
                              ? 'THỦ KHO XUẤT'
                              : 'THỦ KHO'}
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
              ))}
            </>
          )}
        </div>
        {goodRequest.status === 2 && (
          <div className='text-center font-bold mb-4 text-red-500'>
            Yêu cầu đã bị từ chối với lí do: {goodRequest.statusNote}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
