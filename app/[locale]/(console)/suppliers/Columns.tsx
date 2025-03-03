'use client';
import { Supplier } from '@/lib/types/supplier';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    sortingFn: 'text',
  },
  // {
  //   accessorKey: 'name',
  //   header: 'Name',
  //   sortingFn: 'text',
  // },
  // {
  //   accessorKey: 'email',
  //   header: 'Email',
  //   sortingFn: 'text',
  // },
  // {
  //   accessorKey: 'phone',
  //   header: 'Phone',
  //   sortingFn: 'text',
  // },
  // {
  //   accessorKey: 'address',
  //   header: 'Address',
  //   sortingFn: 'text',
  // },
  // {
  //   accessorKey: 'status',
  //   header: 'Status',
  //   cell: ({ row }) => {
  //     const status = row.getValue<boolean>('status');
  //     return (
  //       <span className={status ? 'text-green-600' : 'text-red-600'}>
  //         {status ? 'Active' : 'Inactive'}
  //       </span>
  //     );
  //   },
  //   sortingFn: 'basic',
  // },
  // {
  //   accessorKey: 'actions',
  //   header: () => <div className='text-right w-full'>Actions</div>,
  //   enableSorting: false,
  //   cell: ({}) => {
  //     return <div className='flex justify-end'></div>;
  //   },
  // },
];
