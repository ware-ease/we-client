'use client';
import { Receipt } from '@/lib/types/receipt';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Receipt>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
    sortingFn: 'text',
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date: Date = row.getValue('date');
      const displayDate: string = date.toLocaleString('vi-VN', {
        timeZone: 'UTC',
      });

      return <div className=''>{displayDate}</div>;
    },
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'supplier',
    header: 'Supplier',
    sortingFn: 'text',
  },
  {
    accessorKey: 'shipper',
    header: 'Shipper',
    sortingFn: 'text',
  },
  {
    accessorKey: 'receiver',
    header: 'Receiver',
    sortingFn: 'text',
  },
];
