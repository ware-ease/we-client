/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { ReactNode, useState, useRef, useEffect, useMemo } from 'react';
import InventoryComboBox from '../combo-boxes/InventoryComboBox';
import { useParams } from 'next/navigation';
import { useWarehousesInventories } from '@/hooks/queries/warehouseQueries';

interface Column {
  header: string;
  key: string;
  width: number;
}

interface Row {
  [key: string]: ReactNode;
}

export interface AdjustmentRowData {
  id: string; // inventoryId
  sku: string;
  productName: string;
  unitName: string;
  quantity: number;
  changeInQuantity: number;
  batch: string;
  expDate: string;
  note: string;
  unitType: number;
}

const initialColumns: Column[] = [
  { header: 'Mã hàng', key: 'sku', width: 260 },
  // { header: 'Tên hàng', key: 'productName', width: 200 },
  { header: 'ĐVT', key: 'unitName', width: 90 },
  { header: 'Mã lô', key: 'batch', width: 100 },
  { header: 'Số lượng', key: 'quantity', width: 80 },
  { header: '+/-', key: 'changeInQuantity', width: 50 },
  { header: 'HSD', key: 'expDate', width: 100 },
  { header: 'Ghi chú', key: 'note', width: 120 },
];

interface CustomTableProps {
  onDataChange: (data: AdjustmentRowData[]) => void;
  initialData?: AdjustmentRowData[];
}

const CustomInventoryAdjustmentTable: React.FC<CustomTableProps> = ({
  onDataChange,
  initialData = [],
}) => {
  const { warehouseId } = useParams();
  const { data: warehouseInventories } = useWarehousesInventories(
    warehouseId !== undefined,
    (warehouseId as string) || ''
  );
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const resizingColumn = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const newWidth = useRef<number>(0);
  const prevInitialData = useRef<AdjustmentRowData[]>([]);

  // Track selected inventory IDs
  const selectedInventoryIds = useMemo(() => {
    return rows.map((row) => (row.sku as any).props.value).filter(Boolean);
  }, [rows]);

  // Enable add button only if all rows have an inventory selected
  const isAddButtonEnabled = useMemo(() => {
    return rows.length === 0 || selectedInventoryIds.length === rows.length;
  }, [rows, selectedInventoryIds]);

  const setInitialRows = () => {
    if (!warehouseInventories?.inventories) return;

    if (
      JSON.stringify(prevInitialData.current) !== JSON.stringify(initialData)
    ) {
      // Warn if initialData has duplicate inventory IDs
      const inventoryIdCounts = initialData.reduce((acc, row) => {
        acc[row.id] = (acc[row.id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const duplicates = Object.entries(inventoryIdCounts)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, count]) => count > 1)
        .map(([inventoryId]) => inventoryId);
      if (duplicates.length > 0) {
        console.warn('Duplicate inventory IDs in initialData:', duplicates);
      }

      setRows(
        initialData.map((rowData, index) => {
          const filteredInventories = warehouseInventories.inventories?.filter(
            (i) =>
              i.id === rowData.id ||
              !selectedInventoryIds.includes(i.id) ||
              selectedInventoryIds[index] === i.id
          );

          return {
            sku: (
              <InventoryComboBox
                value={rowData.id || ''}
                onChange={(value) => handleInventorySelect(index, 'sku', value)}
                inventories={filteredInventories}
                fullInfo
              />
            ),
            productName: (
              <div className='p-2 truncate'>{rowData.productName}</div>
            ),
            unit: <div className='p-2 truncate'>{rowData.unitName}</div>,
            batch: <div className='p-2 truncate'>{rowData.batch}</div>,
            quantity: <div className='p-2'>{rowData.quantity}</div>,
            changeInQuantity: (
              <input
                type='number'
                className='w-full p-2'
                value={rowData.changeInQuantity}
                onChange={(e) => handleChangeInQuantity(index, e.target.value)}
              />
            ),
            expDate: <div className='p-2'>{rowData.expDate}</div>,
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
      prevInitialData.current = initialData;
    }
  };

  useEffect(() => {
    setInitialRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warehouseInventories, initialData]);

  useEffect(() => {
    const updatedData: AdjustmentRowData[] = rows.map((row, index) => ({
      id: (row.sku as any).props.value ?? initialData[index]?.id ?? `${index}`,
      sku: (row.sku as any).props.value ?? '',
      productName: (row.productName as any).props.children ?? '',
      unitName: (row.unitName as any).props.children ?? '',
      quantity: Number((row.quantity as any).props.children) || 0,
      changeInQuantity: Number((row.changeInQuantity as any).props.value) || 0,
      batch: (row.batch as any).props.children ?? '',
      expDate: (row.expDate as any).props.children ?? '',
      note: (row.note as any).props.value ?? '',
      unitType:
        warehouseInventories?.inventories?.find(
          (i) => i.id === (row.sku as any).props.value
        )?.batch.product?.unitType || 0,
    }));

    onDataChange(updatedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, onDataChange]);

  const addRow = () => {
    setRows((prevRows) => {
      const filteredInventories =
        warehouseInventories?.inventories?.filter(
          (i) => !selectedInventoryIds.includes(i.id)
        ) || [];
      const newRow: Row = {
        sku: (
          <InventoryComboBox
            value=''
            onChange={(value) =>
              handleInventorySelect(prevRows.length, 'sku', value)
            }
            inventories={filteredInventories}
            fullInfo
          />
        ),
        productName: <div className='p-2 truncate'></div>,
        unitName: <div className='p-2 truncate'></div>,
        batch: <div className='p-2 truncate'></div>,
        quantity: <div className='p-2'>0</div>,
        changeInQuantity: (
          <input
            type='number'
            className='w-full p-2'
            value={0}
            onChange={(e) =>
              handleChangeInQuantity(prevRows.length, e.target.value)
            }
          />
        ),
        expDate: <div className='p-2'></div>,
        note: (
          <input
            type='text'
            className='w-full p-2'
            value=''
            onChange={(e) => handleNoteChange(prevRows.length, e.target.value)}
          />
        ),
      };
      return [...prevRows, newRow];
    });
  };

  const handleInventorySelect = (
    rowIndex: number,
    key: string,
    value: string
  ) => {
    if (!warehouseInventories?.inventories) return;
    const selectedInventory = warehouseInventories?.inventories?.find(
      (i) => i.id === value
    );

    setRows((prevRows) =>
      prevRows.map((row, index) => {
        if (index !== rowIndex) return row;
        const filteredInventories = warehouseInventories?.inventories?.filter(
          (i) =>
            i.id === value ||
            !selectedInventoryIds.includes(i.id) ||
            selectedInventoryIds[index] === i.id
        );
        return {
          ...row,
          [key]: (
            <InventoryComboBox
              value={value}
              onChange={(v) => handleInventorySelect(rowIndex, key, v)}
              inventories={filteredInventories}
              fullInfo
            />
          ),
          productName: (
            <div className='p-2 truncate'>
              {selectedInventory?.batch.product?.name || ''}
            </div>
          ),
          unitName: (
            <div className='p-2 truncate'>
              {selectedInventory?.batch.product?.unitName || ''}
            </div>
          ),
          batch: (
            <div className='p-2 truncate'>
              {selectedInventory?.batch.code || ''}
            </div>
          ),
          quantity: (
            <div className='p-2'>{selectedInventory?.currentQuantity || 0}</div>
          ),
          expDate: (
            <div className='p-2'>{selectedInventory?.batch?.expDate || ''}</div>
          ),
          unitType: selectedInventory?.batch.product?.unitType || 0,
        };
      })
    );
  };

  const handleChangeInQuantity = (rowIndex: number, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              changeInQuantity: (
                <input
                  type='number'
                  className='w-full p-2'
                  value={value}
                  onChange={(e) =>
                    handleChangeInQuantity(index, e.target.value)
                  }
                />
              ),
            }
          : row
      )
    );
  };

  const handleNoteChange = (rowIndex: number, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              note: (
                <input
                  type='text'
                  className='w-full p-2'
                  value={value}
                  onChange={(e) => handleNoteChange(index, e.target.value)}
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
              <div className='w-10'></div>
            </div>
            {warehouseInventories?.inventories &&
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
                    className='text-red-500 hover:text-red-700 px-2 w-10'
                    onClick={() => deleteRow(rowIndex)}
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      {warehouseInventories?.inventories && (
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
    </div>
  );
};

export default CustomInventoryAdjustmentTable;
