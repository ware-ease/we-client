/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { ReactNode, useState, useRef, useEffect, useMemo } from 'react';
import ProductComboBox from '../combo-boxes/ProductComboBox';
import { useWarehousesProducts } from '@/hooks/queries/warehouseQueries';

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

const initialColumns: Column[] = [
  { header: 'Mã hàng', key: 'sku', width: 400 },
  { header: 'Tên hàng', key: 'name', width: 200 },
  { header: 'ĐVT', key: 'unit', width: 85 },
  { header: 'Số lượng', key: 'quantity', width: 80 },
  // { header: 'Mã lô', key: 'batch', width: 80 },
  { header: 'NSX', key: 'mfgDate', width: 120 },
  { header: 'HSD', key: 'expDate', width: 120 },
  { header: 'Ghi chú', key: 'note', width: 200 },
];

interface CustomTableProps {
  onDataChange: (data: RowData[]) => void;
  initialData?: RowData[];
  warehouseId: string;
  isRequestDetails?: boolean;
}

const CustomRequestTable: React.FC<CustomTableProps> = ({
  onDataChange,
  initialData = [],
  warehouseId,
  isRequestDetails = false,
}) => {
  const { data: products } = useWarehousesProducts(true, warehouseId);
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

  // Track selected product IDs
  const selectedProductIds = useMemo(() => {
    return rows.map((row) => (row.sku as any).props.value).filter(Boolean);
  }, [rows]);

  // Enable add button only if all rows have a product selected
  const isAddButtonEnabled = useMemo(() => {
    return rows.length === 0 || selectedProductIds.length === rows.length;
  }, [rows, selectedProductIds]);

  const setInitialRows = () => {
    if (!products) return;

    if (
      JSON.stringify(prevInitialData.current) !== JSON.stringify(initialData)
    ) {
      // Warn if initialData has duplicates
      const productIdCounts = initialData.reduce((acc, row) => {
        if (row.productId) acc[row.productId] = (acc[row.productId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const duplicates = Object.entries(productIdCounts)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, count]) => count > 1)
        .map(([productId]) => productId);
      if (duplicates.length > 0) {
        console.warn('Duplicate product IDs in initialData:', duplicates);
      }

      setRows(
        initialData.map((rowData, index) => {
          const product = products.find((p) => p.id === rowData.productId);
          rowData.isBatchManaged = product?.isBatchManaged;

          const filteredProducts = products.filter(
            (p) =>
              p.id === rowData.productId ||
              !selectedProductIds.includes(p.id) ||
              selectedProductIds[index] === p.id
          );
          const row: Row = {
            sku: (
              <ProductComboBox
                value={rowData.productId || ''}
                onChange={(value) => handleProductSelect(index, 'sku', value)}
                disabled={!isRequestDetails}
                products={isRequestDetails ? filteredProducts : products}
                fullInfo
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
          };
          if (!isRequestDetails) {
            row.batch = (
              <input
                type='text'
                className='w-full p-2'
                value={rowData.batch}
                onChange={(e) => handleBatchChange(index, e.target.value)}
                disabled={rowData.isBatchManaged === false}
              />
            );
            row.mfgDate = (
              <input
                type={rowData.isBatchManaged ? 'date' : 'text'}
                max={new Date().toISOString().split('T')[0]}
                className='w-full p-2'
                value={
                  rowData.isBatchManaged
                    ? rowData.mfgDate || new Date().toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) => handleMfgDateChange(index, e.target.value)}
                disabled={rowData.isBatchManaged === false}
              />
            );
            row.expDate = (
              <input
                type={rowData.isBatchManaged ? 'date' : 'text'}
                min={new Date().toISOString().split('T')[0]}
                className='w-full p-2'
                value={
                  rowData.isBatchManaged
                    ? rowData.expDate || new Date().toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) => handleExpDateChange(index, e.target.value)}
                disabled={rowData.isBatchManaged === false}
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
          mfgDate: (row.mfgDate as any).props.value ?? '',
          expDate: (row.expDate as any).props.value ?? '',
          isBatchManaged: products?.find((p) => p.id === baseData.productId)
            ?.isBatchManaged,
          unitType:
            products?.find((p) => p.id === baseData.productId)?.unitType || 0,
        };
      }
      return {
        ...baseData,
        unitType:
          products?.find((p) => p.id === baseData.productId)?.unitType || 0,
      };
    });

    onDataChange(updatedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, onDataChange]);

  const addRow = () => {
    setRows((prevRows) => {
      const filteredProducts =
        products?.filter((p) => !selectedProductIds.includes(p.id)) || [];
      const newRow: Row = {
        sku: (
          <ProductComboBox
            value=''
            onChange={(value) =>
              handleProductSelect(prevRows.length, 'sku', value)
            }
            disabled={!isRequestDetails}
            products={isRequestDetails ? filteredProducts : products}
            fullInfo
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
          <input
            type='date'
            max={new Date().toISOString().split('T')[0]}
            className='w-full p-2'
            value=''
            disabled
          />
        );
        newRow.expDate = (
          <input
            type='date'
            min={new Date().toISOString().split('T')[0]}
            className='w-full p-2'
            value=''
            disabled
          />
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
    if (isRequestDetails) return;
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
                  max={new Date().toISOString().split('T')[0]}
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
                  min={new Date().toISOString().split('T')[0]}
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
      prevRows.map((row, index) => {
        if (index !== rowIndex) return row;
        const filteredProducts = products.filter(
          (p) =>
            p.id === value ||
            !selectedProductIds.includes(p.id) ||
            selectedProductIds[index] === p.id
        );
        return {
          ...row,
          [key]: (
            <ProductComboBox
              value={value}
              onChange={(v) => handleProductSelect(rowIndex, key, v)}
              disabled={!isRequestDetails}
              products={isRequestDetails ? filteredProducts : products}
              fullInfo
            />
          ),
          name: (
            <div className='p-2 truncate'>{selectedProduct?.name || ''}</div>
          ),
          unit: (
            <div className='p-2 truncate'>
              {selectedProduct?.unitName || ''}
            </div>
          ),
          ...(isRequestDetails
            ? {}
            : {
                batch: (
                  <input
                    type='text'
                    className='border-none w-full p-2'
                    value=''
                    onChange={(e) => handleBatchChange(index, e.target.value)}
                    disabled={selectedProduct?.isBatchManaged === false}
                  />
                ),
                mfgDate: (
                  <input
                    type='date'
                    max={new Date().toISOString().split('T')[0]}
                    className='w-full p-2'
                    value={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleMfgDateChange(index, e.target.value)}
                    disabled={selectedProduct?.isBatchManaged === false}
                  />
                ),
                expDate: (
                  <input
                    type='date'
                    min={new Date().toISOString().split('T')[0]}
                    className='w-full p-2'
                    value={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleExpDateChange(index, e.target.value)}
                    disabled={selectedProduct?.isBatchManaged === false}
                  />
                ),
                note: (
                  <input
                    type='text'
                    className='w-full p-2'
                    value=''
                    onChange={(e) => handleNoteChange(index, e.target.value)}
                  />
                ),
              }),
        };
      })
    );
  };

  const handleBatchChange = (rowIndex: number, value: string) => {
    if (isRequestDetails) return;
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
    <div className='text-sm transform-none'>
      <div className='overflow-auto max-h-[45vh] max-w-[calc(100vw-7rem-var(--sidebar-width))] transform-none'>
        <div className='border min-w-max'>
          <div className='flex flex-col'>
            <div className='flex font-semibold border-b select-none bg-gray-100'>
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
            className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:cursor-not-allowed'
            onClick={addRow}
            disabled={!isAddButtonEnabled}
          >
            Thêm dòng
          </button>
        </div>
      )}
      {!products && (
        <div className='flex items-center justify-center w-full h-40 border-r border-l border-b'>
          Kho này hiện tại không có hàng!
        </div>
      )}
    </div>
  );
};

export default CustomRequestTable;
