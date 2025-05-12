/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Inventory } from '@/types/warehouse';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import InventoryComboBox from '../combo-boxes/InventoryComboBox';
import { Button } from '../shadcn-base/Button';

interface Column {
  header: string;
  key: string;
  width: number;
}

interface Row {
  [key: string]: React.ReactNode;
}

interface InventoryDetail {
  note: string;
  accountId: string;
  inventoryId: string;
  errorTicketId: string;
}

interface CustomInventoryCheckTableProps {
  initialData?: InventoryDetail[];
  inventories: Inventory[];
  onDataChange: (data: InventoryDetail[]) => void;
}

const initialColumns: Column[] = [
  { header: 'Tên hàng (SKU)', key: 'inventoryId', width: 300 },
  { header: 'Ghi chú', key: 'note', width: 200 },
  { header: 'Mã phiếu sự cố', key: 'errorTicketId', width: 100 },
];

const CustomInventoryCheckTable: React.FC<CustomInventoryCheckTableProps> = ({
  initialData = [],
  inventories,
  onDataChange,
}) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const prevInitialData = useRef<InventoryDetail[]>([]);
  const resizingColumn = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const newWidth = useRef<number>(0);

  const selectedInventoryIds = useMemo(() => {
    return rows
      .map((row) => (row.inventoryId as any)?.props.value)
      .filter(Boolean);
  }, [rows]);

  const isAddButtonEnabled = useMemo(() => {
    return rows.length === 0 || selectedInventoryIds.length === rows.length;
  }, [rows, selectedInventoryIds]);

  const setInitialRows = () => {
    if (
      JSON.stringify(prevInitialData.current) !== JSON.stringify(initialData)
    ) {
      const inventoryIdCounts = initialData.reduce((acc, row) => {
        acc[row.inventoryId] = (acc[row.inventoryId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const duplicates = Object.entries(inventoryIdCounts)
        .filter(([, count]) => count > 1)
        .map(([inventoryId]) => inventoryId);
      if (duplicates.length > 0) {
        console.warn('Duplicate inventory IDs in initialData:', duplicates);
      }

      setRows(
        initialData.map((rowData, index) => {
          const filteredInventories = inventories.filter(
            (inv) =>
              inv.id === rowData.inventoryId ||
              !selectedInventoryIds.includes(inv.id) ||
              selectedInventoryIds[index] === inv.id
          );

          return {
            inventoryId: (
              <InventoryComboBox
                value={rowData.inventoryId || ''}
                onChange={(value) =>
                  handleInventorySelect(index, 'inventoryId', value)
                }
                inventories={filteredInventories}
                fullInfo
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

      prevInitialData.current = initialData;
    }
  };

  useEffect(() => {
    setInitialRows();
  }, [initialData, inventories]);

  useEffect(() => {
    const updatedData: InventoryDetail[] = rows.map((row, index) => ({
      note: (row.note as any).props.value ?? '',
      accountId: initialData[index]?.accountId || '',
      inventoryId: (row.inventoryId as any).props.value ?? '',
      errorTicketId: initialData[index]?.errorTicketId || '',
    }));
    onDataChange(updatedData);
  }, [rows, onDataChange]);

  const handleInventorySelect = (
    rowIndex: number,
    key: string,
    value: string
  ) => {
    const filteredInventories = inventories.filter(
      (inv) =>
        inv.id === value ||
        !selectedInventoryIds.includes(inv.id) ||
        selectedInventoryIds[rowIndex] === inv.id
    );

    setRows((prevRows) =>
      prevRows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              [key]: (
                <InventoryComboBox
                  value={value}
                  onChange={(v) => handleInventorySelect(index, key, v)}
                  inventories={filteredInventories}
                  fullInfo
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

  const addRow = () => {
    const filteredInventories = inventories.filter(
      (i) => !selectedInventoryIds.includes(i.id)
    );
    const newRow: Row = {
      inventoryId: (
        <InventoryComboBox
          value=''
          onChange={(value) =>
            handleInventorySelect(rows.length, 'inventoryId', value)
          }
          inventories={filteredInventories}
          fullInfo
        />
      ),
      note: (
        <input
          type='text'
          className='w-full p-2'
          value=''
          onChange={(e) => handleNoteChange(rows.length, e.target.value)}
        />
      ),
    };
    setRows((prev) => [...prev, newRow]);
  };

  const deleteRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
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
    <div className='space-y-4'>
      <div className='border rounded-lg overflow-hidden'>
        <table className='w-full text-sm border-collapse'>
          <thead className='bg-muted'>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className='relative border px-3 py-2 text-left'
                  style={{ width: `${col.width}px` }}
                >
                  <div className='flex items-center'>
                    {col.header}
                    <div
                      className='absolute right-0 top-0 h-full w-2 cursor-col-resize'
                      onMouseDown={(e) => handleMouseDown(index, e)}
                    />
                  </div>
                </th>
              ))}
              <th className='w-10'></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className='border-t'>
                <td className='border px-3 py-2'>{row.inventoryId}</td>
                <td className='border px-3 py-2'>
                  <input
                    type='text'
                    className='w-full p-2'
                    value={row.note?.toString() || ''}
                    onChange={(e) => handleNoteChange(i, e.target.value)}
                  />
                </td>

                <td className='border px-3 py-2'>
                  <input
                    type='text'
                    value={row.errorTicketId?.toString() || ''}
                    onChange={(e) => handleNoteChange(i, e.target.value)}
                    className='w-full border rounded px-2 py-1'
                  />
                </td>
                <td className='text-center'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => deleteRow(i)}
                    className='text-destructive hover:bg-destructive/10'
                  >
                    ✕
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <Button onClick={addRow} disabled={!isAddButtonEnabled}>
          Thêm dòng
        </Button>
      </div>
    </div>
  );
};

export default CustomInventoryCheckTable;
