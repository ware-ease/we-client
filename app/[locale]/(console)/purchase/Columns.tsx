'use client';

import { Purchase } from '@/lib/types/purchase';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    sortingFn: 'text',
  },
  {
    accessorKey: 'supplier',
    header: 'Supplier',
    sortingFn: 'text',
  },
  {
    accessorKey: 'product',
    header: 'Product',
    sortingFn: 'text',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    sortingFn: 'basic',
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    sortingFn: 'basic',
    cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    sortingFn: 'text',
  },
  {
    accessorKey: 'actions',
    header: () => <div className='text-right w-full'>Actions</div>,
    enableSorting: false,
    cell: () => {
      return <div className='flex justify-end'>...</div>;
    },
  },
];
