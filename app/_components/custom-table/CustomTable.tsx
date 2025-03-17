'use client';
import React, { ReactNode, useState, useRef } from 'react';
import ProductComboBox from '../combo-boxes/ProductComboBox';

interface Column {
  header: string;
  key: string;
  width: number;
}

interface Row {
  [key: string]: ReactNode;
}

const initialColumns: Column[] = [
  { header: 'STT', key: 'id', width: 48 },
  { header: 'Mã hàng', key: 'sku', width: 202 },
  { header: 'Tên hàng', key: 'name', width: 200 },
  { header: 'ĐVT', key: 'unit', width: 80 },
  { header: 'Số lượng', key: 'quantity', width: 100 },
  { header: 'Lô hàng', key: 'batch', width: 202 },
  { header: 'Ghi chú', key: 'note', width: 370 },
];

const rowTemplate: Row = {
  sku: (
    <div className='truncate'>
      <ProductComboBox />
    </div>
  ),
  name: <div className='p-2 truncate'>Xi măng S1</div>,
  unit: <div className='p-2 truncate'>Bao 10kg</div>,
  quantity: <input type='number' className='border-none w-full p-2' />,
  batch: (
    <div className='truncate'>
      <ProductComboBox />
    </div>
  ),
  note: <input type='text' className='w-full p-2' />,
};

const CustomTable: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [data, setData] = useState<Row[]>([]);
  const resizingColumn = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const newWidth = useRef<number>(0);

  const addRow = () => {
    setData([
      ...data,
      {
        ...rowTemplate,
        id: <div className='p-2'>{(data.length + 1).toString()}</div>,
      },
    ]);
  };

  const deleteRow = (index: number) => {
    setData(data.filter((_, i) => i !== index));
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
            {data.map((row, rowIndex) => (
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

      <div className='py-4 flex justify-start'>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded'
          onClick={addRow}
        >
          Thêm dòng
        </button>
      </div>
    </div>
  );
};

export default CustomTable;
