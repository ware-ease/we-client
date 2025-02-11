'use client';
import { Product } from '@/lib/types/product';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    sortingFn: 'text',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: false,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);

      return <div className='font-medium'>{formatted}</div>;
    },
    sortingFn: 'alphanumeric',
    sortDescFirst: false,
  },
  {
    accessorKey: 'actions',
    header: () => <div className='text-right w-full'>Actions</div>,
    enableSorting: false,
    cell: ({}) => {
      return <div className='flex justify-end'></div>;
    },
  },
];
