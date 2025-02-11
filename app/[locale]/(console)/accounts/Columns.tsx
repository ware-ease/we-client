'use client';
import UpdateAccountDialog from '@/app/_components/dialogs/UpdateAccountDialog';
import { ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Account = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const columns: ColumnDef<Account>[] = [
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
    cell: ({ row }) => {
      return (
        <div className='flex justify-end'>
          <UpdateAccountDialog account={row.original} />
        </div>
      );
    },
  },
];
