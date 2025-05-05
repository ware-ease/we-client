'use client';
import React, { useEffect, useState } from 'react';

interface InventoryDetail {
  countedQuantity: number;
  note: string;
  inventoryId: string;
  errorTicketId: string;
}

interface CustomInventoryCheckTableProps {
  initialData?: InventoryDetail[];
  onDataChange: (data: InventoryDetail[]) => void;
}

const columns = [
  { header: 'Số lượng kiểm kê', key: 'countedQuantity' },
  { header: 'Ghi chú', key: 'note' },
  { header: 'Mã tồn kho', key: 'inventoryId' },
  { header: 'Mã phiếu lỗi', key: 'errorTicketId' },
];

const CustomInventoryCheckTable: React.FC<CustomInventoryCheckTableProps> = ({
  initialData = [],
  onDataChange,
}) => {
  const [data, setData] = useState<InventoryDetail[]>(initialData);

  useEffect(() => {
    onDataChange(data);
  }, [data, onDataChange]);

  const handleChange = (
    index: number,
    key: keyof InventoryDetail,
    value: string
  ) => {
    const updated = [...data];
    if (key === 'countedQuantity') {
      updated[index][key] = Number(value);
    } else {
      updated[index][key] = value;
    }
    setData(updated);
  };

  const addRow = () => {
    setData([
      ...data,
      { countedQuantity: 0, note: '', inventoryId: '', errorTicketId: '' },
    ]);
  };

  const deleteRow = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  return (
    <div className='text-sm'>
      <div className='overflow-auto max-h-[45vh]'>
        <table className='min-w-max border w-full'>
          <thead>
            <tr className='bg-gray-100'>
              {columns.map((col) => (
                <th key={col.key} className='border px-2 py-1 text-left'>
                  {col.header}
                </th>
              ))}
              <th className='w-10'></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className='border-t'>
                {columns.map((col) => (
                  <td key={col.key} className='border px-2 py-1'>
                    <input
                      type={col.key === 'countedQuantity' ? 'number' : 'text'}
                      value={row[col.key as keyof InventoryDetail]}
                      onChange={(e) =>
                        handleChange(
                          i,
                          col.key as keyof InventoryDetail,
                          e.target.value
                        )
                      }
                      className='w-full p-1 border rounded'
                    />
                  </td>
                ))}
                <td className='text-center'>
                  <button onClick={() => deleteRow(i)} className='text-red-500'>
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='py-4'>
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

export default CustomInventoryCheckTable;
