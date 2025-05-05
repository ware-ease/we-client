'use client';
import { cn } from '@/lib/utils/utils';
import { Inventory } from '@/types/warehouse';
import { Check, ChevronsUpDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../shadcn-base/Button';
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from '../shadcn-base/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../shadcn-base/Popover';

interface InventoryDetail {
  countedQuantity: number;
  note: string;
  inventoryId: string;
  errorTicketId: string;
}

interface CustomInventoryCheckTableProps {
  initialData?: InventoryDetail[];
  inventories: Inventory[];
  onDataChange: (data: InventoryDetail[]) => void;
}

// function removeVietnameseTones(str: string) {
//   return str
//     .normalize('NFD') // tách dấu khỏi ký tự
//     .replace(/[\u0300-\u036f]/g, '') // xóa các dấu
//     .replace(/đ/g, 'd')
//     .replace(/Đ/g, 'D')
//     .toLowerCase(); // chuyển về chữ thường
// }

const CustomInventoryCheckTable: React.FC<CustomInventoryCheckTableProps> = ({
  initialData = [],
  inventories,
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

  const getInventoryLabel = (inv: Inventory) =>
    `${inv.batch.product?.name}
 (${inv.batch.code}) - SKU: ${inv.batch.product?.sku} | Tồn: ${inv.currentQuantity}`;

  return (
    <div className='text-sm'>
      <div className='overflow-auto max-h-[45vh]'>
        <table className='min-w-max border w-full'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='border px-2 py-1'>Sản phẩm - Lô hàng</th>
              <th className='border px-2 py-1'>Số lượng kiểm kê</th>
              <th className='border px-2 py-1'>Ghi chú</th>
              <th className='border px-2 py-1'>Mã phiếu lỗi</th>
              <th className='w-10'></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className='border-t'>
                <td className='border px-2 py-1'>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='outline'
                        role='combobox'
                        className='w-full justify-between'
                      >
                        {row.inventoryId
                          ? getInventoryLabel(
                              inventories.find(
                                (inv) => inv.id === row.inventoryId
                              )!
                            )
                          : 'Chọn sản phẩm'}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-full p-0'>
                      <Command>
                        <CommandInput placeholder='Tìm sản phẩm...' />
                        <CommandList>
                          {inventories.map((inv) => (
                            <CommandItem
                              key={inv.id}
                              value={inv.id}
                              onSelect={() => {
                                if (inv.id) {
                                  handleChange(i, 'inventoryId', inv.id);
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  row.inventoryId === inv.id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              {getInventoryLabel(inv)}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </td>

                <td className='border px-2 py-1'>
                  <input
                    type='number'
                    value={row.countedQuantity}
                    onChange={(e) =>
                      handleChange(i, 'countedQuantity', e.target.value)
                    }
                    className='w-full p-1 border rounded'
                  />
                </td>
                <td className='border px-2 py-1'>
                  <input
                    type='text'
                    value={row.note}
                    onChange={(e) => handleChange(i, 'note', e.target.value)}
                    className='w-full p-1 border rounded'
                  />
                </td>
                <td className='border px-2 py-1'>
                  <input
                    type='text'
                    value={row.errorTicketId}
                    onChange={(e) =>
                      handleChange(i, 'errorTicketId', e.target.value)
                    }
                    className='w-full p-1 border rounded'
                  />
                </td>
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
