'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { Link, usePathname } from '@/lib/i18n/routing';
import { Button } from '../../shadcn-base/Button';
import { Batch } from '@/types/batch';
import { useBatches } from '@/hooks/queries/batchQueries';

export const columns: ColumnDef<Batch>[] = [
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
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mã phiếu' />
    ),
    meta: {
      title: 'Mã phiếu',
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày thực hiện' />
    ),
    cell: ({ row }) => new Date(row.getValue('date')).toLocaleString('vi-VN'),
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
      title: 'Ngày thực hiện',
      type: 'date',
    },
  },
  {
    accessorKey: 'requestedWarehouseName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kho nhận' />
    ),
    meta: {
      title: 'Kho nhận',
    },
  },
  {
    accessorKey: 'goodRequestId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Yêu cầu' />
    ),
    meta: {
      title: 'Yêu cầu',
    },
  },
  {
    accessorKey: 'shipperName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Người giao hàng' />
    ),
    meta: {
      title: 'Người giao hàng',
    },
  },
  {
    accessorKey: 'receiverName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Người nhận hàng' />
    ),
    meta: {
      title: 'Người nhận hàng',
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
];

const BatchTable = () => {
  const pathname = usePathname();
  const { data, isSuccess } = useBatches();

  return (
    <CustomDataTable columns={columns} data={isSuccess ? data : []}>
      <Link href={`${pathname}/create`}>
        <Button>Thêm</Button>
      </Link>
    </CustomDataTable>
  );
};

export default BatchTable;
