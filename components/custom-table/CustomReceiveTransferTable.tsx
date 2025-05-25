'use client';
import React, { ReactNode } from 'react';

interface Column {
  header: string;
  key: string;
  width: number;
}

interface Row {
  [key: string]: ReactNode;
}

export interface RowData {
  id: string;
  sku: string;
  name: string;
  unit: string;
  quantity: number;
  batch: string;
  mfgDate: string;
  expDate: string;
  note: string;
  productId?: string;
  isBatchManaged?: boolean;
  unitType: number;
}

const columns: Column[] = [
  { header: 'Mã hàng', key: 'sku', width: 220 },
  { header: 'Tên hàng', key: 'name', width: 200 },
  { header: 'ĐVT', key: 'unit', width: 85 },
  { header: 'Số lượng', key: 'quantity', width: 80 },
  { header: 'Mã lô', key: 'batch', width: 150 },
  { header: 'NSX', key: 'mfgDate', width: 120 },
  { header: 'HSD', key: 'expDate', width: 120 },
  { header: 'Ghi chú', key: 'note', width: 200 },
];

interface CustomReceiveTransferTableProps {
  initialData?: RowData[];
}

const CustomReceiveTransferTable: React.FC<CustomReceiveTransferTableProps> = ({
  initialData = [],
}) => {
  const rows: Row[] = initialData.map((rowData) => ({
    sku: <div className='p-2 truncate'>{rowData.sku || 'N/A'}</div>,
    name: <div className='p-2 truncate'>{rowData.name || 'N/A'}</div>,
    unit: <div className='p-2 truncate'>{rowData.unit || 'N/A'}</div>,
    quantity: <div className='p-2 text-right'>{rowData.quantity || 0}</div>,
    batch: <div className='p-2 truncate'>{rowData.batch || 'N/A'}</div>,
    mfgDate: (
      <div className='p-2 truncate'>
        {rowData.mfgDate > new Date('01-01-0001').toISOString()
          ? rowData.mfgDate
          : ''}
      </div>
    ),
    expDate: (
      <div className='p-2 truncate'>
        {' '}
        {rowData.expDate > new Date('01-01-0001').toISOString()
          ? rowData.expDate
          : ''}
      </div>
    ),
    note: <div className='p-2 truncate'>{rowData.note || 'N/A'}</div>,
  }));

  return (
    <div className='text-sm'>
      <div className='overflow-auto max-h-[45vh] max-w-[calc(100vw-7rem-var(--sidebar-width))]'>
        <div className='border min-w-max border-gray-200'>
          <div className='flex flex-col'>
            <div className='flex font-semibold border-b select-none bg-gray-100'>
              {columns.map((col, index) => (
                <div
                  key={index}
                  className='p-2 whitespace-nowrap border-r last:border-none box-border text-gray-700'
                  style={{ width: `${col.width}px` }}
                >
                  {col.header}
                </div>
              ))}
            </div>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className='flex border-b last:border-none items-center hover:bg-gray-50'
                >
                  {columns.map((col, colIndex) => (
                    <div
                      key={colIndex}
                      className='whitespace-nowrap border-r last:border-none box-border'
                      style={{ width: `${col.width}px` }}
                    >
                      {row[col.key]}
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className='flex items-center justify-center p-4 text-gray-600'>
                Không có chi tiết
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomReceiveTransferTable;
