/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import ProductComboBox from '../combo-boxes/ProductComboBox';
import { useProducts } from '@/hooks/queries/productQueries';

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
}

const initialColumns: Column[] = [
  { header: 'Mã hàng', key: 'sku', width: 180 },
  { header: 'Tên hàng', key: 'name', width: 200 },
  { header: 'ĐVT', key: 'unit', width: 85 },
  { header: 'Số lượng', key: 'quantity', width: 80 },
  { header: 'Mã lô', key: 'batch', width: 80 },
  { header: 'NSX', key: 'mfgDate', width: 120 },
  { header: 'HSD', key: 'expDate', width: 120 },
  { header: 'Ghi chú', key: 'note', width: 240 },
];

interface CustomTableProps {
  onDataChange: (data: RowData[]) => void;
  initialData?: RowData[];
  isRequestDetails?: boolean; // New optional param
}

const CustomTable: React.FC<CustomTableProps> = ({
  onDataChange,
  initialData = [],
  isRequestDetails = false, // Default to false
}) => {
  const { data: products } = useProducts();
  const [columns, setColumns] = useState<Column[]>(() =>
    isRequestDetails
      ? initialColumns.filter(
          (col) =>
            col.key !== 'batch' &&
            col.key !== 'note' &&
            col.key !== 'mfgDate' &&
            col.key !== 'expDate'
        )
      : initialColumns
  );
  const [rows, setRows] = useState<Row[]>([]);
  const resizingColumn = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const newWidth = useRef<number>(0);
  const prevInitialData = useRef<RowData[]>([]);

  const setInitialRows = () => {
    if (!products) return;

    if (
      JSON.stringify(prevInitialData.current) !== JSON.stringify(initialData)
    ) {
      setRows(
        initialData.map((rowData, index) => {
          const product = products.find((p) => p.id === rowData.productId);
          const row: Row = {
            sku: (
              <ProductComboBox
                value={rowData.productId || ''}
                onChange={(value) => handleProductSelect(index, 'sku', value)}
              />
            ),
            name: <div className='p-2 truncate'>{rowData.name}</div>,
            unit: <div className='p-2 truncate'>{product?.unit}</div>,
            quantity: (
              <input
                type='number'
                className='border-none w-full p-2'
                value={rowData.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
              />
            ),
          };
          if (!isRequestDetails) {
            row.batch = (
              <input
                type='text'
                className='w-full p-2'
                value={rowData.batch}
                onChange={(e) => handleBatchChange(index, e.target.value)}
              />
            );
            row.mfgDate = (
              <input
                type='date'
                className='w-full p-2'
                value={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleMfgDateChange(index, e.target.value)}
              />
            );
            row.expDate = (
              <input
                type='date'
                className='w-full p-2'
                value={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleExpDateChange(index, e.target.value)}
              />
            );
            row.note = (
              <input
                type='text'
                className='w-full p-2'
                value={rowData.note}
                onChange={(e) => handleNoteChange(index, e.target.value)}
              />
            );
          }
          return row;
        })
      );
      prevInitialData.current = initialData;
    }
  };

  useEffect(() => {
    setInitialRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, initialData]);

  useEffect(() => {
    const updatedData: RowData[] = rows.map((row, index) => {
      const baseData = {
        id: initialData[index]?.id || `${index}`,
        sku: (row.sku as any).props.value ?? '',
        name: (row.name as any).props.children ?? '',
        unit: (row.unit as any).props.children ?? '',
        quantity: (row.quantity as any).props.value ?? 0,
        batch: '',
        note: '',
        productId: (row.sku as any).props.value ?? '',
        mfgDate: '',
        expDate: '',
      };
      if (!isRequestDetails) {
        return {
          ...baseData,
          batch: (row.batch as any).props.value ?? '',
          note: (row.note as any).props.value ?? '',
          productId: (row.sku as any).props.value ?? '',
          batchId: (row.batch as any).props.value ?? '',
          mfgDate: '',
          expDate: '',
        };
      }
      return baseData;
    });

    onDataChange(updatedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, onDataChange]);

  const addRow = () => {
    setRows((prevRows) => {
      const newRow: Row = {
        sku: (
          <ProductComboBox
            value=''
            onChange={(value) =>
              handleProductSelect(prevRows.length, 'sku', value)
            }
          />
        ),
        name: <div className='p-2 truncate'></div>,
        unit: <div className='p-2 truncate'></div>,
        quantity: (
          <input
            type='number'
            className='border-none w-full p-2'
            value={0}
            onChange={(e) =>
              handleQuantityChange(prevRows.length, e.target.value)
            }
          />
        ),
      };
      if (!isRequestDetails) {
        newRow.batch = (
          <input
            type='text'
            className='w-full p-2'
            value=''
            onChange={(e) => handleBatchChange(prevRows.length, e.target.value)}
            disabled
          />
        );
        newRow.mfgDate = (
          <input type='date' className='w-full p-2' value='' disabled />
        );
        newRow.expDate = (
          <input type='date' className='w-full p-2' value='' disabled />
        );
        newRow.note = (
          <input
            type='text'
            className='w-full p-2'
            value=''
            onChange={(e) => handleNoteChange(prevRows.length, e.target.value)}
            disabled
          />
        );
      }
      return [...prevRows, newRow];
    });
  };

  const handleQuantityChange = (rowIndex: number, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              quantity: (
                <input
                  type='number'
                  className='border-none w-full p-2'
                  value={value}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              ),
            }
          : row
      )
    );
  };

  const handleNoteChange = (rowIndex: number, value: string) => {
    if (isRequestDetails) return; // No note column in request details mode
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              note: (
                <input
                  type='text'
                  className='border-none w-full p-2'
                  value={value}
                  onChange={(e) => handleNoteChange(index, e.target.value)}
                />
              ),
            }
          : row
      )
    );
  };

  const handleMfgDateChange = (rowIndex: number, value: string) => {
    if (isRequestDetails) return;
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              mfgDate: (
                <input
                  type='date'
                  className='border-none w-full p-2'
                  value={value}
                  onChange={(e) => handleMfgDateChange(index, e.target.value)}
                />
              ),
            }
          : row
      )
    );
  };

  const handleExpDateChange = (rowIndex: number, value: string) => {
    if (isRequestDetails) return;
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              expDate: (
                <input
                  type='date'
                  className='border-none w-full p-2'
                  value={value}
                  onChange={(e) => handleExpDateChange(index, e.target.value)}
                />
              ),
            }
          : row
      )
    );
  };

  const handleProductSelect = (
    rowIndex: number,
    key: string,
    value: string
  ) => {
    if (!products) return;
    const selectedProduct = products.find((p) => p.id === value);
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              [key]: (
                <ProductComboBox
                  value={value}
                  onChange={(v) => handleProductSelect(rowIndex, key, v)}
                />
              ),
              name: (
                <div className='p-2 truncate'>
                  {selectedProduct?.name || ''}
                </div>
              ),
              unit: (
                <div className='p-2 truncate'>
                  {selectedProduct?.unit || ''}
                </div>
              ),
              mfgDate: (
                <input
                  type='date'
                  className='w-full p-2'
                  value={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleMfgDateChange(index, e.target.value)}
                  disabled={false}
                />
              ),
              expDate: (
                <input
                  type='date'
                  className='w-full p-2'
                  value={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleExpDateChange(index, e.target.value)}
                  disabled={false}
                />
              ),
              ...(isRequestDetails
                ? {}
                : {
                    batch: (
                      <input
                        type='text'
                        className='border-none w-full p-2'
                        value=''
                        onChange={(e) =>
                          handleBatchChange(index, e.target.value)
                        }
                      />
                    ),
                  }),
            }
          : row
      )
    );
  };

  const handleBatchChange = (rowIndex: number, value: string) => {
    if (isRequestDetails) return; // No note column in request details mode
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              batch: (
                <input
                  type='text'
                  className='border-none w-full p-2'
                  value={value}
                  onChange={(e) => handleBatchChange(index, e.target.value)}
                />
              ),
            }
          : row
      )
    );
  };

  const deleteRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    resizingColumn.current = index;
    startX.current = e.clientX;
    newWidth.current = columns[index].width;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (resizingColumn.current === null) return;

    const diff = e.clientX - startX.current;
    newWidth.current = Math.max(
      50,
      columns[resizingColumn.current].width + diff
    );
  };

  const handleMouseUp = () => {
    if (resizingColumn.current !== null) {
      const updatedColumns = [...columns];
      updatedColumns[resizingColumn.current].width = newWidth.current;
      setColumns(updatedColumns);
    }

    resizingColumn.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className='text-sm'>
      <div className='overflow-auto h-[45h] max-h-[45vh] max-w-[calc(100vw-7rem-var(--sidebar-width))]'>
        <div className='border min-w-max'>
          <div className='flex flex-col'>
            <div className='flex font-semibold border-b select-none'>
              {columns.map((col, index) => (
                <div
                  key={index}
                  className='relative flex items-center'
                  style={{ width: `${col.width}px` }}
                >
                  <div className='p-2 whitespace-nowrap border-r last:border-none box-border w-full truncate'>
                    {col.header}
                  </div>
                  <div
                    className='absolute right-0 top-0 h-full w-2 cursor-col-resize'
                    onMouseDown={(e) => handleMouseDown(index, e)}
                  />
                </div>
              ))}
              <div></div>
            </div>
            {products &&
              rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className='flex border-b last:border-none items-center'
                >
                  {columns.map((col, colIndex) => (
                    <div
                      key={colIndex}
                      className='whitespace-nowrap last:border-none border-r box-border'
                      style={{ width: `${col.width}px` }}
                    >
                      {row[col.key]}
                    </div>
                  ))}
                  <button
                    className='text-red-500 hover:text-red-700 px-2'
                    onClick={() => deleteRow(rowIndex)}
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      {products && isRequestDetails && (
        <div className='py-4 flex justify-start'>
          <button
            className='bg-blue-500 text-white px-4 py-2 rounded'
            onClick={addRow}
          >
            Thêm dòng
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomTable;
