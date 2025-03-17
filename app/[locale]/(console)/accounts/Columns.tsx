import { Account } from '@/lib/types/account';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Account>[] = [
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
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => row.original.username || 'N/A',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email || 'N/A',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: ({ row }) => row.original.profile?.firstName || 'N/A',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: ({ row }) => row.original.profile?.lastName || 'N/A',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'nationality',
    header: 'Nationality',
    cell: ({ row }) => row.original.profile?.nationality || 'N/A',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => row.original.profile?.phone || 'N/A',
    filterFn: 'includesString',
  },
  {
    accessorKey: 'sex',
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
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === 'all') return true;
      return filterValue === 'male'
        ? row.original.profile?.sex === true
        : row.original.profile?.sex === false;
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
  // {
  //   accessorKey: 'actions',
  //   header: () => <div className='text-right w-full'>Actions</div>,
  //   enableSorting: false,
  //   enableColumnFilter: false,
  //   cell: ({ row }) => (
  //     <div className='flex justify-end'>
  //       <UpdateAccountDialog account={row.original} />
  //     </div>
  //   ),
  // },
];
