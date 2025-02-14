'use client';
import { Product } from '@/lib/types/product';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    sortingFn: 'text',
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
    sortingFn: 'text',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    sortingFn: 'text',
  },
  {
    accessorKey: 'description',
    header: 'Description',
    sortingFn: 'text',
  },
  {
    accessorKey: 'category',
    header: 'Category',
    sortingFn: 'text',
  },
  {
    accessorKey: 'types',
    header: 'Types',
    sortingFn: 'text',
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
    cell: ({}) => {
      return <div className='flex justify-end'></div>;
    },
  },
];
