'use client';

import CreatedByUI from '@/components/app/CreatedByUI';
import { ViewInventoryCountDialog } from '@/components/dialogs/ViewInventoryCountDialog';
import { statusFilterFn } from '@/lib/tanstack-table/customFilterFn';
import { getAccountTasks } from '@/services/accountService';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import StatusStepper from './StatusStepper';

export interface AccountTask {
  id: string;
  status: number;
  expectedQuantity: number;
  countedQuantity: number;
  note: string;
  accountId: string;
  inventoryId: string;
  batchId: string;
  batchCode: string;
  productName: string;
  createdBy: string;
  createdTime: string;
  createdByAvatarUrl: string;
  createdByFullName: string;
  createdByGroup: string;
  code?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  warehouseId?: string;
}

export const columns: ColumnDef<AccountTask>[] = [
  {
    accessorKey: 'productName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sản phẩm' />
    ),
    cell: ({ row }) => row.getValue('productName') || 'N/A',
    meta: {
      title: 'Sản phẩm',
    },
  },
  {
    accessorKey: 'batchCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lô hàng' />
    ),
    cell: ({ row }) => row.getValue('batchCode') || 'N/A',
    meta: {
      title: 'Lô hàng',
    },
  },
  {
    accessorKey: 'note',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ghi chú' />
    ),
    cell: ({ row }) => row.getValue('note') || '—',
    meta: {
      title: 'Ghi chú',
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => (
      <StatusStepper
        status={row.original.status}
        inventoryCounts={row.original}
      />
    ),
    filterFn: statusFilterFn,
    meta: {
      title: 'Trạng thái',
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
    accessorKey: 'createdTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày tạo' />
    ),
    cell: ({ row }) => {
      const createdTime = row.getValue('createdTime') as string;
      if (!createdTime) return 'N/A';
      const [datePart, timePart] = createdTime.split(' ');
      const [month, day, year] = datePart.split('/');
      const formattedDate = new Date(`${year}-${month}-${day}T${timePart}`);
      return formattedDate.toLocaleString('vi-VN');
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue?.from && !filterValue?.to) return true;
      const createdTime = row.getValue(columnId) as string;
      if (!createdTime) return false;
      const [datePart, timePart] = createdTime.split(' ');
      const [month, day, year] = datePart.split('/');
      const rowDate = new Date(`${year}-${month}-${day}T${timePart}`);
      const fromDate = filterValue.from ? new Date(filterValue.from) : null;
      const toDate = filterValue.to ? new Date(filterValue.to) : null;
      if (toDate) toDate.setHours(23, 59, 59, 999);
      if (fromDate && toDate) return rowDate >= fromDate && rowDate <= toDate;
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
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Thao tác' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <ViewInventoryCountDialog inventoryCount={row.original} />
      </div>
    ),
    meta: {
      title: 'Thao tác',
    },
  },
];

//////////////////////////////////////////////
const AccountTaskTable = () => {
  const [accountTasks, setAccountTasks] = useState<AccountTask[]>([]);
  
  useEffect(() => {
    getAccountTasks().then((res) => {
      setAccountTasks(res);
      console.log('Fetched account tasks:', res);
    });
  }, []);

  return (
    <CustomDataTable columns={columns} data={accountTasks}>
      <div className='w-full flex justify-between'>
        <div className='space-x-2'></div>
      </div>
    </CustomDataTable>
  );
};

export default AccountTaskTable;
