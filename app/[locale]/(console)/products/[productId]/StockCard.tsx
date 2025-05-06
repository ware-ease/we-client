'use client';
import React, { useRef, useState } from 'react';
import { Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { StockCard as StockCardType } from '@/types/warehouse';
import { Button } from '@/components/shadcn-base/Button';
import { Input } from '@/components/shadcn-base/Input';

const StockCard: React.FC<{ data: StockCardType }> = ({ data }) => {
  const contentRef = useRef(null);
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');

  console.log(data);

  // Print function for browser print dialog
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `The_Kho_${data.productCode}`,
  });

  // Format date or return 'Không có' for invalid dates
  const formatDate = (date: string | undefined) => {
    if (!date || typeof date !== 'string') return 'Không có';
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime())
      ? 'Không có'
      : parsedDate.toLocaleDateString('vi-VN');
  };

  // Filter details based on expDate and inboundDate
  const filteredDetails = data.details.filter((detail) => {
    // Expiration date filter
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

  // Clear all filters
  const clearFilters = () => {
    setDateStart('');
    setDateEnd('');
  };

  return (
    <div className='container mx-auto p-4 max-w-6xl'>
      {/* Display View */}
      <div className='bg-white border border-gray-200 shadow-md rounded-xl p-6 mb-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold text-gray-800'>Thẻ Kho</h2>
          <div className='space-x-2'>
            <button
              onClick={() => handlePrint()}
              className='flex items-center bg-blue-500 text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition-colors'
            >
              <Printer className='w-4 h-4 mr-2' />
              In
            </button>
          </div>
        </div>

        {/* Filter Section */}
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
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <div>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Kho:</strong>{' '}
              {data.warehouseName}
            </p>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Mã hàng:</strong>{' '}
              {data.productCode}
            </p>
          </div>
          <div>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Tên hàng:</strong>{' '}
              {data.productName}
            </p>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Đơn vị tính:</strong>{' '}
              {data.unitName}
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
              {filteredDetails.length > 0 ? (
                filteredDetails.map((detail, index) => (
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
                    Không có giao dịch
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print View */}
      <div className='hidden print:block' ref={contentRef}>
        <div
          className='p-8 bg-white'
          style={{ width: '210mm', minHeight: '297mm' }}
        >
          {/* Header */}
          <div className='flex justify-between mb-6'>
            <div>
              <h1 className='text-2xl font-bold'>TNT PROJECTS</h1>
              {/* Placeholder for logo */}
              <div className='w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-500'>
                Logo
              </div>
            </div>
            <div className='text-right'>
              <h1 className='text-3xl font-bold'>THẺ KHO</h1>
              <p className='mt-2'>
                <strong>Kho:</strong> {data.warehouseName}
              </p>
              <p>
                <strong>Mã hàng:</strong> {data.productCode}
              </p>
              <p>
                <strong>Tên hàng:</strong> {data.productName}
              </p>
              <p>
                <strong>Đơn vị tính:</strong> {data.unitName}
              </p>
            </div>
          </div>

          {/* Table */}
          <table className='w-full border-collapse border border-black'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border border-black p-2 text-left'>Ngày</th>
                <th className='border border-black p-2 text-left'>Chứng từ</th>
                <th className='border border-black p-2 text-left'>Diễn giải</th>
                <th className='border border-black p-2 text-right'>Nhập</th>
                <th className='border border-black p-2 text-right'>Xuất</th>
                <th className='border border-black p-2 text-right'>Tồn</th>
                <th className='border border-black p-2 text-left'>
                  Ngày nhập kho
                </th>
                <th className='border border-black p-2 text-left'>
                  Ngày hết hạn
                </th>
                <th className='border border-black p-2 text-left'>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {data.details.length > 0 ? (
                data.details.map((detail, index) => (
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

          {/* Footer */}
          <div className='mt-8 text-center'>
            <p className='text-lg font-semibold'>THỦ KHO</p>
            <p>(Ký, họ tên)</p>
            <div className='mt-4 h-12 border-b border-black w-40 mx-auto'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
