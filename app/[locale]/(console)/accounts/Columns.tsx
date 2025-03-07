'use client';
import UpdateAccountDialog from '@/app/_components/dialogs/UpdateAccountDialog';
import { Account } from '@/lib/types/account';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'profile.firstName',
    header: 'First Name',
    cell: ({ row }) => row.original.profile?.firstName || 'N/A',
  },
  {
    accessorKey: 'profile.lastName',
    header: 'Last Name',
    cell: ({ row }) => row.original.profile?.lastName || 'N/A',
  },
  {
    accessorKey: 'profile.nationality',
    header: 'Nationality',
    cell: ({ row }) => row.original.profile?.nationality || 'N/A',
  },
  {
    accessorKey: 'profile.phone',
    header: 'Phone',
    cell: ({ row }) => row.original.profile?.phone || 'N/A',
  },
  {
    accessorKey: 'profile.sex',
    header: 'Sex',
    cell: ({ row }) => {
      const sex = row.original.profile?.sex;
      return (
        <span
          className={
            sex ? 'text-green-500 font-medium' : 'text-red-500 font-medium'
          }
        >
          {sex ? 'Male' : 'Female'}
        </span>
      );
    },
  },

  // {
  //   accessorKey: 'groups',
  //   header: 'Groups',
  //   cell: ({ row }) => {
  //     const groups =
  //       row.original.groups?.map((group) => group.name).join(', ') ||
  //       'No Groups';
  //     return <span>{groups}</span>;
  //   },
  // },
  {
    accessorKey: 'actions',
    header: () => <div className='text-right w-full'>Actions</div>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className='flex justify-end'>
        <UpdateAccountDialog account={row.original} />
      </div>
    ),
  },
];
