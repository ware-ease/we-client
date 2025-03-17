'use client';
import { Product } from '@/lib/types/product';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'stt',
    header: 'STT',
    enableColumnFilter: false,
    enableSorting: false,
    cell: ({ row, table }) => {
      const rowIndex = table
        .getRowModel()
        .rows.findIndex((r) => r.id === row.id);
      return rowIndex + 1;
    },
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
    sortingFn: 'text',
  },
  {
    accessorKey: 'name',
    header: 'Tên',
    sortingFn: 'text',
  },
  {
    accessorKey: 'productType',
    header: 'Loại',
    sortingFn: 'text',
  },
  {
    accessorKey: 'category',
    header: 'Danh mục',
    sortingFn: 'text',
  },
  {
    accessorKey: 'unit',
    header: 'Đơn vị',
    sortingFn: 'text',
  },
  {
    accessorKey: 'brand',
    header: 'Hãng',
    sortingFn: 'text',
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    sortingFn: 'text',
  },
  {
    accessorKey: 'actions',
    header: () => <div className='text-right w-full'>Hành động</div>,
    enableSorting: false,
    cell: ({}) => {
      return <div className='flex justify-end'></div>;
    },
  },
];
