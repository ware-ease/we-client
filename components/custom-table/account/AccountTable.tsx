'use client';
import AccountStatusUI from '@/components/app/AccountStatusUI';
import CreatedByUI from '@/components/app/CreatedByUI';
import DetailAccountDialog from '@/components/dialogs/ViewAccountDialogs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';
import { useAccounts } from '@/hooks/queries/accountQueries';
import { accountStatusFilterFn } from '@/lib/tanstack-table/customFilterFn';
import { Account } from '@/types/account';
import { ColumnDef } from '@tanstack/react-table';
import AddAccountDialog from '../../dialogs/AddAccountDialog';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên đăng nhập' />
    ),
    cell: ({ row }) => <p className='font-medium'>{row.original.username}</p>,
    meta: {
      title: 'Tên đăng nhập',
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    meta: {
      title: 'Email',
    },
  },
  {
    accessorFn: ({ profile }) => `${profile.lastName} ${profile.firstName}`,
    id: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên' className='text-xs' />
    ),
    cell: ({ row }) => (
      <>
        {row.original.profile.lastName} {row.original.profile.firstName}
      </>
    ),
    meta: {
      title: 'Tên',
    },
  },
  {
    id: 'groups',
    accessorFn: ({ groups }) =>
      groups?.map((g) => g.name).join(', ') || 'Không có',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nhóm' className='text-xs' />
    ),
    cell: ({ row }) => {
      const groups = row.original.groups;
      if (!groups?.length)
        return <span className='text-gray-400'>Không có</span>;

      const getGroupColor = (id: string) => {
        switch (id) {
          case '1':
            return 'bg-blue-100 text-blue-800';
          case '2':
            return 'bg-green-100 text-green-800';
          case '3':
            return 'bg-yellow-100 text-yellow-800';
          case '4':
            return 'bg-purple-100 text-purple-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };

      return (
        <div className='flex flex-wrap gap-1 items-center text-center'>
          {groups.map((group) => (
            <span
              key={group.id}
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getGroupColor(
                group.id
              )}`}
            >
              {group.name}
            </span>
          ))}
        </div>
      );
    },
    meta: {
      title: 'Nhóm',
    },
  },

  // {
  //   id: 'warehouses',
  //   // accessorFn: ({warehouses }) => `${warehouses[]} ${profile.firstName}`,
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title='Kho phụ trách'
  //       className='text-xs'
  //     />
  //   ),
  //   cell: ({ row }) => {
  //     const account = row.original;
  //     const isWarehouseUser = account.groups.some(
  //       (g) => g.id === '2' || g.id === '3'
  //     );

  //     if (!isWarehouseUser || !account.warehouses?.length) return null;

  //     return (
  //       <ul className='list-disc list-inside text-sm text-gray-700'>
  //         {account.warehouses.map((wh) => (
  //           <li key={wh.id}>{wh.name}</li>
  //         ))}
  //       </ul>
  //     );
  //   },
  //   meta: {
  //     title: 'Kho phụ trách',
  //   },
  // },
  {
    accessorKey: 'profile.nationality',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Quốc tịch' />
    ),
    meta: {
      title: 'Quốc tịch',
    },
  },
  {
    accessorKey: 'profile.phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số điện thoại' />
    ),
    meta: {
      title: 'Số điện thoại',
    },
  },
  {
    id: 'sex',
    accessorKey: 'profile.sex',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Giới tính' />
    ),
    cell: ({ row }) => {
      const sex = row.getValue('sex');
      return (sex as boolean) ? (
        <span className='text-blue-500 font-medium'>Nam</span>
      ) : (
        <span className='text-pink-500 font-medium'>Nữ</span>
      );
    },
    meta: {
      title: 'Giới tính',
    },
  },
  {
    accessorKey: 'createdTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày tạo' />
    ),
    cell: ({ row }) =>
      new Date(row.getValue('createdTime')).toLocaleString('vi-VN'),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue?.from && !filterValue?.to) return true;
      const rowDate = new Date(row.getValue(columnId));
      const fromDate = filterValue.from ? new Date(filterValue.from) : null;
      const toDate = filterValue.to ? new Date(filterValue.to) : null;

      if (toDate) {
        toDate.setHours(23, 59, 59, 999);
      }

      if (fromDate && toDate) {
        return rowDate >= fromDate && rowDate <= toDate;
      }
      if (fromDate) return rowDate >= fromDate;
      if (toDate) return rowDate <= toDate;

      return true;
    },
    meta: {
      title: 'Ngày tạo',
      type: 'date',
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => {
      return (
        <AccountStatusUI
          status={row.original.status || 0}
          accountId={row.original.id || ''}
          username={row.original.username}
        />
      );
    },
    filterFn: accountStatusFilterFn,
    meta: {
      title: 'Trạng thái',
      type: 'select',
      options: ['Chưa xác thực', 'Đã xác thực', 'Đã khóa'],
    },
  },
  {
    id: 'createdBy',
    accessorFn: ({ createdByFullName }) =>
      `${createdByFullName || 'Người bí ẩn'}`,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Tạo bởi'
        className='text-xs'
      />
    ),
    cell: ({ row }) => (
      <CreatedByUI
        fullName={row.original.createdByFullName || 'Ware Ease'}
        group={row.original.createdByGroup || 'Hệ thống'}
        avatarUrl={
          row.original.createdByAvatarUrl || 'https://github.com/shadcn.png'
        }
      />
    ),
    meta: {
      title: 'Tạo bởi',
    },
  },
  {
    id: 'crud-actions',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Hành động'
        className='text-xs'
      />
    ),
    cell: ({ row }) => {
      const account = row.original;

      return (
        <div className='flex space-x-2'>
          <Tooltip>
            <TooltipTrigger>
              <DetailAccountDialog account={account} />
            </TooltipTrigger>
            <TooltipContent>Chi tiết</TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];

const AccountTable = () => {
  const { data, isSuccess } = useAccounts();
  console.log(data);

  return (
    <CustomDataTable columns={columns} data={isSuccess ? data : []}>
      <AddAccountDialog />
    </CustomDataTable>
  );
};

export default AccountTable;
