'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import AddAccountDialog from '../../dialogs/AddAccountDialog';
import { useAccounts } from '@/hooks/queries/accountQueries';
import { Account } from '@/types/account';

export const columns: ColumnDef<Account>[] = [
  {
    id: 'stt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='STT' className='text-xs' />
    ),
    cell: ({ row }) => row.index + 1,
    meta: {
      title: 'STT',
    },
  },
  {
    accessorKey: 'id',
    enableHiding: false,
    enableColumnFilter: false,
    header: () => null,
    cell: () => null,
    meta: {
      title: 'ID',
    },
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên đăng nhập' />
    ),
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
    accessorKey: 'profile.lastName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Họ' />
    ),
    meta: {
      title: 'Họ',
    },
  },
  {
    accessorKey: 'profile.firstName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên' />
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
  // {
  //   id: 'crud-actions',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader
  //       column={column}
  //       title='Hành động'
  //       className='text-xs'
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <div className='flex space-x-2'>
  //       {/* Gắn nút mở dialog Edit/Delete rồi dùng {row.getValue('id')} để truyền id vào */}
  //       <Edit className='text-yellow-500' size={20} />
  //     </div>
  //   ),
  // },
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
