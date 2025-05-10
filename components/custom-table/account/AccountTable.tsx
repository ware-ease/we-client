'use client';
import DetailAccountDialog from '@/components/dialogs/ViewAccountDialogs';
import { useAccounts } from '@/hooks/queries/accountQueries';
import { Account } from '@/types/account';
import { ColumnDef } from '@tanstack/react-table';
import AddAccountDialog from '../../dialogs/AddAccountDialog';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';
import AccountStatusUI from '@/components/app/AccountStatusUI';
import { accountStatusFilterFn } from '@/lib/tanstack-table/customFilterFn';
import CreatedByUI from '@/components/app/CreatedByUI';

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên đăng nhập' />
    ),
    cell: ({ row }) => <strong>{row.original.username}</strong>,
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
        fullName={row.original.createdByFullName || 'Người bí ẩn'}
        group={row.original.createdByGroup || 'Nhóm'}
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

  return (
    <CustomDataTable columns={columns} data={isSuccess ? data : []}>
      <AddAccountDialog />
    </CustomDataTable>
  );
};

export default AccountTable;
