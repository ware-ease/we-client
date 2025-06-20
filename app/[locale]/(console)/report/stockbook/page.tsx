/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useRef, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/shadcn-base/Button';
import { useSearchParams } from 'next/navigation';
import { useWarehousesStockBook } from '@/hooks/queries/warehouseQueries';
import { useRouter } from '@/lib/i18n/routing';
import WarehouseComboBox from '@/components/combo-boxes/WarehouseComboBox';
import * as XLSX from 'xlsx-js-style'; // Import xlsx-js-style for styling
import { ExportDialog } from '@/components/dialogs/ExportDialog';

const ReportStockBook = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const contentRef = useRef(null);
  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [warehouseId, setWarehouseId] = useState<string>(
    searchParams.get('warehouseId') as string
  );

  const { data: stockbook } = useWarehousesStockBook(
    !!warehouseId && !!month && !!year,
    warehouseId,
    month ? parseInt(month) : 0,
    year ? parseInt(year) : 0
  );

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `The_Kho_${stockbook?.warehouseName || 'StockBook'}`,
  });

  const clearFilters = () => {
    setMonth('');
    setYear('');
  };

  const handleWarehouseChange = (e: string) => {
    const newWarehouseId = e;
    setWarehouseId(newWarehouseId);
    router.push(`/report/stockbook?warehouseId=${newWarehouseId}`);
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Tháng ${i + 1}`,
  }));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2019 }, (_, i) => ({
    value: (2020 + i).toString(),
    label: (2020 + i).toString(),
  }));

  const handleExport = () => {
    if (!stockbook?.details || stockbook.details.length === 0) {
      alert('Không có dữ liệu để xuất.');
      return;
    }

    const exportData = [
      ['SỔ KHO'],
      ['Tháng', `${month}/${year}`],
      ['Tên kho', stockbook?.warehouseName || ''],
      ['Địa chỉ', stockbook?.address || ''],
      ['Người phụ trách', stockbook?.inCharge || ''],
      [],
      [
        'Ngày',
        'Mã hàng',
        'Tên hàng',
        'Mã lô',
        'Chứng từ',
        'Diễn giải',
        'Nhập',
        'Xuất',
        'Tồn đầu kỳ',
        'Tồn cuối kỳ',
      ],
      ...stockbook.details.map((detail) => [
        detail.date || '',
        detail.sku || '',
        detail.productName || '',
        detail.batchCode || '',
        detail.code || '',
        detail.description || '',
        detail.import > 0 ? detail.import.toLocaleString('vi-VN') : '',
        detail.export > 0 ? detail.export.toLocaleString('vi-VN') : '',
        detail.openingStock.toLocaleString('vi-VN'),
        detail.closingStock.toLocaleString('vi-VN'),
      ]),
    ];

    const styles = {
      title: {
        font: { name: 'Times New Roman', sz: 16, bold: true },
        alignment: { horizontal: 'center' },
      },
      header: {
        font: { name: 'Times New Roman', sz: 12, bold: true },
        fill: { fgColor: { rgb: 'E6E6FA' } },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      },
      cell: {
        font: { name: 'Times New Roman', sz: 11 },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      },
    };

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);

    const ensureCellExists = (cellAddress: string) => {
      if (!worksheet[cellAddress]) {
        worksheet[cellAddress] = { v: '', t: 's' };
      }
    };

    ensureCellExists('A1');
    worksheet['A1'].s = styles.title;

    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }];

    const headerRow = 7;
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].forEach((col) => {
      const cellAddress = `${col}${headerRow}`;
      ensureCellExists(cellAddress);
      worksheet[cellAddress].s = styles.header;
    });

    const dataStartRow = 8;
    stockbook.details.forEach((_, index) => {
      const row = dataStartRow + index;
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].forEach((col) => {
        const cellAddress = `${col}${row}`;
        ensureCellExists(cellAddress);
        worksheet[cellAddress].s = styles.cell;
      });
    });

    const wscols = [
      { wch: 15 }, // Ngày
      { wch: 15 }, // Mã hàng
      { wch: 20 }, // Tên hàng
      { wch: 15 }, // Mã lô
      { wch: 15 }, // Chứng từ
      { wch: 30 }, // Diễn giải
      { wch: 10 }, // Nhập
      { wch: 10 }, // Xuất
      { wch: 15 }, // Tồn đầu kỳ
      { wch: 15 }, // Tồn cuối kỳ
    ];
    worksheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'StockBook');

    XLSX.writeFile(
      workbook,
      `The_Kho_${stockbook?.warehouseName || 'StockBook'}_${month}_${year}.xlsx`
    );
  };

  return (
    <div className='p-6'>
      <div className='bg-white border border-gray-200 shadow-md rounded-xl p-6 mb-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold text-gray-800'>
            Báo cáo xuất nhập tồn - Sổ kho
          </h2>
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
              <ExportDialog
                title='Sổ kho'
                onConfirmExport={handleExport}
                description='Bạn có muốn xuất sổ kho này thành file Excel?'
              >
                <button className='flex items-center bg-green-600 text-white px-4 py-2 rounded-3xl hover:bg-green-700 transition-colors'>
                  <Download className='w-4 h-4 mr-2' />
                  Xuất
                </button>
              </ExportDialog>
            </div>
          </div>
        </div>

        <div className='mb-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
              Chọn kỳ xuất nhập tồn
            </h3>
            <div className='flex space-x-2'>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className='w-full border border-gray-300 rounded p-2 text-black'
              >
                <option value=''>Chọn tháng</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className='w-full border border-gray-300 rounded p-2 text-black'
              >
                <option value=''>Chọn năm</option>
                {years.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
                  </option>
                ))}
              </select>
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
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <div>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Kho:</strong>{' '}
              {stockbook?.warehouseName}
            </p>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Địa chỉ:</strong>{' '}
              {stockbook?.address}
            </p>
          </div>
          <div>
            <p className='text-gray-600'>
              <strong className='text-gray-700'>Người phụ trách:</strong>{' '}
              {stockbook?.inCharge}
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
                  Mã hàng
                </th>
                <th className='border border-gray-200 p-2 text-left text-gray-700'>
                  Tên hàng
                </th>
                <th className='border border-gray-200 p-2 text-left text-gray-700'>
                  Mã lô
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
                  Tồn đầu kỳ
                </th>
                <th className='border border-gray-200 p-2 text-right text-gray-700'>
                  Tồn cuối kỳ
                </th>
              </tr>
            </thead>
            <tbody>
              {stockbook?.details && stockbook?.details.length > 0 ? (
                stockbook.details.map((detail, index) => (
                  <tr key={index} className='hover:bg-gray-50'>
                    <td className='border border-gray-200 p-2'>
                      {detail.date}
                    </td>
                    <td className='border border-gray-200 p-2'>
                      {detail.sku || ''}
                    </td>
                    <td className='border border-gray-200 p-2'>
                      {detail.productName || ''}
                    </td>
                    <td className='border border-gray-200 p-2'>
                      {detail.batchCode || ''}
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
                      {detail.openingStock.toLocaleString('vi-VN')}
                    </td>
                    <td className='border border-gray-200 p-2 text-right'>
                      {detail.closingStock.toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10} // Updated to 10 columns
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

      <div className='hidden print:block' ref={contentRef}>
        <div
          className='p-24 bg-white'
          style={{ fontFamily: 'Times New Roman' }}
        >
          <div className='mb-6 w-full'>
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
              <div className='text-left'>
                <p>
                  <strong className='font-normal'>SỔ KHO</strong>
                </p>
                <p>
                  <strong className='font-normal'>Tháng:</strong> {month}/{year}
                </p>
              </div>
            </div>
          </div>

          <div className='text-center text-xl font-bold mt-20 text-[#2F5597]'>
            SỔ KHO
          </div>
          <div>
            <p>
              <strong className='font-normal'>Tên kho:</strong>{' '}
              {stockbook?.warehouseName || ''}
            </p>
            <p>
              <strong className='font-normal'>Địa chỉ:</strong>{' '}
              {stockbook?.address || ''}
            </p>
            <p>
              <strong className='font-normal'>Người phụ trách:</strong>{' '}
              {stockbook?.inCharge || ''}
            </p>
          </div>

          <table className='border border-black mt-4 text-xs'>
            <thead>
              <tr className='text-left font-normal'>
                <th className='border-r border-black p-2 font-normal'>Ngày</th>
                <th className='border-r border-black p-2 font-normal'>
                  Mã hàng
                </th>
                <th className='border-r border-black p-2 font-normal'>
                  Tên hàng
                </th>
                <th className='border-r border-black p-2 font-normal'>Mã lô</th>
                <th className='border-r border-black p-2 font-normal'>
                  Chứng từ
                </th>
                <th className='border-r border-black p-2 font-normal'>
                  Diễn giải
                </th>
                <th className='border-r border-black p-2 font-normal'>Nhập</th>
                <th className='border-r border-black p-2 font-normal'>Xuất</th>
                <th className='border-r border-black p-2 font-normal'>
                  Tồn đầu kỳ
                </th>
                <th className='p-2 font-normal'>Tồn cuối kỳ</th>
              </tr>
            </thead>
            <tbody>
              {stockbook?.details && stockbook?.details.length > 0 ? (
                stockbook.details.map((detail, index) => (
                  <tr key={index}>
                    <td className='border border-black p-2'>{detail.date}</td>
                    <td className='border border-black p-2'>
                      {detail.sku || ''}
                    </td>
                    <td className='border border-black p-2'>
                      {detail.productName || ''}
                    </td>
                    <td className='border border-black p-2'>
                      {detail.batchCode || ''}
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
                      {detail.openingStock.toLocaleString('vi-VN')}
                    </td>
                    <td className='border border-black p-2 text-right'>
                      {detail.closingStock.toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10} // Updated to 10 columns
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
                  <strong>THỦ KHO</strong>
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

export default ReportStockBook;
