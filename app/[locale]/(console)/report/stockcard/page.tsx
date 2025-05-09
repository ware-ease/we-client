'use client';
import React, { useRef, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/shadcn-base/Button';
import { Input } from '@/components/shadcn-base/Input';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useWarehousesStockCardByProductID } from '@/hooks/queries/warehouseQueries';
import { useProducts } from '@/hooks/queries/productQueries';
import { useRouter } from '@/lib/i18n/routing';
import ProductComboBox from '@/components/combo-boxes/ProductComboBox';
import WarehouseComboBox from '@/components/combo-boxes/WarehouseComboBox';

const ReportStockCard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const contentRef = useRef(null);
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [warehouseId, setWarehouseId] = useState<string>(
    (searchParams.get('warehouseId') as string) || ''
  );
  const [productId, setProductId] = useState<string>(
    (searchParams.get('productId') as string) || ''
  );

  const { data: products } = useProducts();
  const { data } = useWarehousesStockCardByProductID(
    true,
    warehouseId,
    productId
  );

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `The_Kho_${data?.productCode}`,
  });

  const formatDate = (date: string | undefined) => {
    if (!date || typeof date !== 'string') return 'Không có';
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? 'Không có'
      : parsedDate.toLocaleDateString('vi-VN');
  };

  const filteredDetails = data?.details.filter((detail) => {
    let expDatePass = true;
    if (dateStart && detail.date) {
      const expDate = new Date(detail.date);
      const start = new Date(dateStart);
      expDatePass = !isNaN(expDate.getTime()) && expDate >= start;
    }
    if (dateEnd && detail.date) {
      const expDate = new Date(detail.date);
      const end = new Date(dateEnd);
      expDatePass = expDatePass && !isNaN(expDate.getTime()) && expDate <= end;
    }

    return expDatePass;
  });

  const clearFilters = () => {
    setDateStart('');
    setDateEnd('');
  };

  const handleWarehouseChange = (e: string) => {
    const newWarehouseId = e;
    setWarehouseId(newWarehouseId);
    router.push(
      `/report/stockcard?productId=${productId}&warehouseId=${newWarehouseId}`
    );
  };

  const handleProductChange = (e: string) => {
    const newProductId = e;
    setProductId(newProductId);
    router.push(
      `/report/stockcard?productId=${newProductId}&warehouseId=${warehouseId}`
    );
  };

  return (
    <div className='p-6'>
      <div className='bg-white border border-gray-200 shadow-md rounded-xl p-6 mb-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold text-gray-800'>Thẻ Kho</h2>
          <div className='flex space-x-2'>
            <div className='space-x-2'>
              <button
                onClick={() => handlePrint()}
                className='flex items-center bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition-colors'
              >
                <Printer className='w-4 h-4 mr-2' />
                In
              </button>
            </div>
            <div className='space-x-2'>
              <button
                onClick={() => handlePrint()}
                className='flex items-center bg-green-600 text-white px-4 py-2 rounded-3xl hover:bg-green-700 transition-colors'
              >
                <Download className='w-4 h-4 mr-2' />
                Xuất
              </button>
            </div>
          </div>
        </div>

        <div className='mb-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
              Ngày nhập xuất
            </h3>
            <div className='flex space-x-2'>
              <Input
                type='date'
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className='border border-gray-300 rounded p-2 w-full'
                placeholder='Từ ngày'
              />
              <Input
                type='date'
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className='border border-gray-300 rounded p-2 w-full'
                placeholder='Đến ngày'
              />
              <Button className='h-full' onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          </div>
          <div className='flex w-full space-x-4'>
            <div className='w-1/3'>
              <h3 className='text-lg font-semibold text-gray-700 mb-2'>
                Kho hiện tại
              </h3>
              <div className='w-full'>
                <WarehouseComboBox
                  value={warehouseId}
                  onlyAssignedWarehouses
                  onChange={(e) => handleWarehouseChange(e)}
                />
              </div>
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold text-gray-700 mb-2'>
                Sản phẩm
              </h3>
              {products && (
                <div className='w-full'>
                  <ProductComboBox
                    value={productId}
                    products={products}
                    onChange={(e) => handleProductChange(e)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <div>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Kho:</strong>{' '}
              {data?.warehouseName}
            </p>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Mã hàng:</strong>{' '}
              {data?.productCode}
            </p>
          </div>
          <div>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Tên hàng:</strong>{' '}
              {data?.productName}
            </p>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Đơn vị tính:</strong>{' '}
              {data?.unitName}
            </p>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse border border-gray-200'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-gray-200 p-2 text-left text-gray-700'>
                  Ngày
                </th>
                <th className='border border-gray-200 p-2 text-left text-gray-700'>
                  Chứng từ
                </th>
                <th className='border border-gray-200 p-2 text-left text-gray-700'>
                  Diễn giải
                </th>
                <th className='border border-gray-200 p-2 text-right text-gray-700'>
                  Nhập
                </th>
                <th className='border border-gray-200 p-2 text-right text-gray-700'>
                  Xuất
                </th>
                <th className='border border-gray-200 p-2 text-right text-gray-700'>
                  Tồn
                </th>
                <th className='border border-gray-200 p-2 text-left text-gray-700'>
                  Ghi chú
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDetails && filteredDetails.length > 0 ? (
                filteredDetails?.map((detail, index) => (
                  <tr key={index} className='hover:bg-gray-50'>
                    <td className='border border-gray-200 p-2'>
                      {formatDate(detail.date)}
                    </td>
                    <td className='border border-gray-200 p-2'>
                      {detail.code}
                    </td>
                    <td className='border border-gray-200 p-2'>
                      {detail.description}
                    </td>
                    <td className='border border-gray-200 p-2 text-right'>
                      {detail.import > 0
                        ? detail.import.toLocaleString('vi-VN')
                        : ''}
                    </td>
                    <td className='border border-gray-200 p-2 text-right'>
                      {detail.export > 0
                        ? detail.export.toLocaleString('vi-VN')
                        : ''}
                    </td>
                    <td className='border border-gray-200 p-2 text-right'>
                      {detail.stock.toLocaleString('vi-VN')}
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
                    Không có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className='hidden print:block' ref={contentRef}>
        <div
          className='p-24 bg-white'
          style={{ fontFamily: 'Times New Roman' }}
        >
          <div className='mb-6 w-full'>
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
              <div className='text-left'>
                <p>
                  <strong className='font-normal'>THẺ KHO</strong>
                </p>
                <p>
                  <strong className='font-normal'>Kho:</strong>{' '}
                  {data?.warehouseName || ''}
                </p>
                <p>
                  <strong className='font-normal'>Mã hàng:</strong>{' '}
                  {data?.productCode || ''}
                </p>
                <p>
                  <strong className='font-normal'>Tên hàng:</strong>{' '}
                  {data?.productName || ''}
                </p>
                <p>
                  <strong className='font-normal'>Đơn vị tính:</strong>{' '}
                  {data?.unitName || ''}
                </p>
              </div>
            </div>
          </div>

          <div className='text-center text-xl font-bold mt-20 text-[#2F5597]'>
            THẺ KHO
          </div>

          {/* Table */}
          <table className='w-full border border-black mt-4'>
            <thead>
              <tr className='text-left font-normal'>
                <th className='border-r border-black p-2 font-normal'>Ngày</th>
                <th className='border-r border-black p-2 font-normal'>
                  Chứng từ
                </th>
                <th className='border-r border-black p-2 font-normal'>
                  Diễn giải
                </th>
                <th className='border-r border-black p-2 font-normal'>Nhập</th>
                <th className='border-r border-black p-2 font-normal'>Xuất</th>
                <th className='border-r border-black p-2 font-normal'>Tồn</th>
                <th className='p-2 font-normal'>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {filteredDetails ? (
                filteredDetails?.map((detail, index) => (
                  <tr key={index}>
                    <td className='border border-black p-2'>
                      {formatDate(detail.date)}
                    </td>
                    <td className='border border-black p-2'>{detail.code}</td>
                    <td className='border border-black p-2'>
                      {detail.description}
                    </td>
                    <td className='border border-black p-2 text-right'>
                      {detail.import > 0
                        ? detail.import.toLocaleString('vi-VN')
                        : ''}
                    </td>
                    <td className='border border-black p-2 text-right'>
                      {detail.export > 0
                        ? detail.export.toLocaleString('vi-VN')
                        : ''}
                    </td>
                    <td className='border border-black p-2 text-right'>
                      {detail.stock.toLocaleString('vi-VN')}
                    </td>
                    <td className='border border-black p-2'>
                      {detail.note || ''}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className='border border-black p-2 text-center'
                  >
                    Không có giao dịch
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className='mt-8 text-center'>
            <div className='flex justify-end mt-10 mr-6'>
              <div className='text-center w-1/2'>Ngày...Tháng...Năm...</div>
            </div>
            <div className='flex justify-end mt-2 w-full'>
              <div className='text-center w-1/2'>
                <p>
                  <strong>{'THỦ KHO'}</strong>
                </p>
                <p>(Ký, họ tên)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportStockCard;
