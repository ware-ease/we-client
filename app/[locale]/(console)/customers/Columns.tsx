'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Customer = {
  id: string;
  name: string;
  phone: string;
  status: boolean;
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    sortingFn: 'text',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue<boolean>('status');
      return (
        <span className={status ? 'text-green-600' : 'text-red-600'}>
          {status ? 'Active' : 'Inactive'}
        </span>
      );
    },
    sortingFn: 'basic',
  },
  {
    accessorKey: 'actions',
    header: () => <div className='text-right w-full'>Actions</div>,
    enableSorting: false,
    cell: ({}) => {
      return (
        <div className='flex justify-end'>
          {/* <UpdateCustomerDialog customer={row.original} /> */}
        </div>
      );
    },
  },
];
