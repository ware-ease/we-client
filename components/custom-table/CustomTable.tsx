/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import ProductComboBox from '../combo-boxes/ProductComboBox';
import BatchComboBox from '../combo-boxes/BatchComboBox';
import { useProducts } from '@/hooks/queries/productQueries';
import { useBatches } from '@/hooks/queries/batchQueries';

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
  note: string;
  productId?: string;
  batchId?: string;
}

const initialColumns: Column[] = [
  // { header: 'STT', key: 'id', width: 48 },
  { header: 'Mã hàng', key: 'sku', width: 202 },
  { header: 'Tên hàng', key: 'name', width: 200 },
  { header: 'ĐVT', key: 'unit', width: 85 },
  { header: 'Số lượng', key: 'quantity', width: 100 },
  { header: 'Lô hàng', key: 'batch', width: 202 },
  { header: 'Ghi chú', key: 'note', width: 370 },
];

interface CustomTableProps {
  onDataChange: (data: RowData[]) => void;
  initialData?: RowData[];
}

const CustomTable: React.FC<CustomTableProps> = ({
  onDataChange,
  initialData,
}) => {
  const { data: products } = useProducts();
  const { data: batches } = useBatches();

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [rows, setRows] = useState<Row[]>([]);
  const resizingColumn = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const newWidth = useRef<number>(0);

  const setInitialRows = () => {
    if (!products || !batches) return;

    setRows(
      (initialData ?? []).map((rowData, index) => {
        const selectedProduct = products.find(
          (p) => p.id === rowData.productId
        );
        const filteredBatches = batches.filter(
          (b) => b.productId === selectedProduct?.id
        );
        return {
          sku: (
            <ProductComboBox
              value={rowData.productId || ''}
              onChange={(value) => handleProductSelect(index, 'sku', value)}
            />
          ),
          name: <div className='p-2 truncate'>{rowData.name}</div>,
          unit: <div className='p-2 truncate'>{rowData.unit}</div>,
          quantity: (
            <input
              type='number'
              className='border-none w-full p-2'
              value={rowData.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
            />
          ),
          batch: (
            <BatchComboBox
              batches={filteredBatches}
              value={rowData.batchId || ''}
              onChange={(batchValue) =>
                handleBatchSelect(
                  index,
                  'batch',
                  batchValue,
                  rowData.productId || ''
                )
              }
              productId={rowData.productId || ''}
            />
          ),
          note: (
            <input
              type='text'
              className='w-full p-2'
              value={rowData.note}
              onChange={(e) => handleNoteChange(index, e.target.value)}
            />
          ),
        };
      })
    );
  };

  useEffect(() => {
    setInitialRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, batches]);

  useEffect(() => {
    const updatedData: RowData[] = rows.map((row) => ({
      id: '',
      sku: (row.sku as any).props.value ?? '',
      name: (row.name as any).props.children ?? '',
      unit: (row.unit as any).props.children ?? '',
      quantity: (row.quantity as any).props.value ?? 0,
      batch: (row.batch as any).props.value ?? '',
      note: (row.note as any).props.value ?? '',
    }));

    onDataChange(updatedData);
  }, [rows, onDataChange]);

  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
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
            onChange={(e) => handleQuantityChange(rows.length, e.target.value)}
          />
        ),
        batch: <input type='text' className='w-full p-2' value='' disabled />,
        note: (
          <input
            type='text'
            className='w-full p-2'
            value=''
            onChange={(e) => handleNoteChange(rows.length, e.target.value)}
          />
        ),
      },
    ]);
  };

  const handleQuantityChange = (rowIndex: number, value: string) => {
    console.log(rowIndex);
    setRows((prevRows) => {
      return prevRows.map((row, index) =>
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
      );
    });
  };

  const handleNoteChange = (rowIndex: number, value: string) => {
    setRows((prevRows) => {
      return prevRows.map((row, index) =>
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
      );
    });
  };

  const handleProductSelect = (
    rowIndex: number,
    key: string,
    value: string
  ) => {
    if (!products || !batches) return;
    const selectedProduct = products.find((p) => p.id === value);

    const filteredBatches = batches.filter(
      (b) => b.productId === selectedProduct?.id
    );

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
              batch: (
                <BatchComboBox
                  batches={filteredBatches}
                  value=''
                  onChange={(batchValue) =>
                    handleBatchSelect(
                      rowIndex,
                      'batch',
                      batchValue,
                      selectedProduct?.id || ''
                    )
                  }
                  productId={selectedProduct?.id || ''}
                />
              ),
            }
          : row
      )
    );
  };

  const handleBatchSelect = (
    rowIndex: number,
    key: string,
    value: string,
    productId: string
  ) => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              [key]: (
                <BatchComboBox
                  batches={(row.batch as any).props.batches || []}
                  value={value}
                  onChange={(v) =>
                    handleBatchSelect(rowIndex, key, v, productId)
                  }
                  productId={productId}
                />
              ),
            }
          : row
      )
    );
  };

  const deleteRow = (index: number) => {
    //FIXME: fix STT khi them va xoa
    setRows(rows.filter((_, i) => i !== index));
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
      <div className='overflow-auto h-[45h] max-h-[45vh] max-w-[calc(100vw-2rem-var(--sidebar-width))]'>
        <div className='border min-w-max'>
          <div className='flex flex-col'>
            {/* Header Row */}
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
                  {/* Resize Handle */}
                  <div
                    className='absolute right-0 top-0 h-full w-2 cursor-col-resize'
                    onMouseDown={(e) => handleMouseDown(index, e)}
                  />
                </div>
              ))}
              <div></div> {/* Empty space for delete button */}
            </div>

            {/* Data Rows */}
            {products &&
              batches &&
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

      {products && batches && (
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
