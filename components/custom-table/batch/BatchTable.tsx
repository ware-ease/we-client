'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { Link, usePathname } from '@/lib/i18n/routing';
import { Button } from '../../shadcn-base/Button';
import { Batch } from '@/types/batch';
import { useBatches } from '@/hooks/queries/batchQueries';
import ExpireDateUI from '@/components/app/ExpireDateUI';

export const columns: ColumnDef<Batch>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mã lô' />
    ),
    meta: {
      title: 'Mã lô',
    },
  },
  {
    accessorKey: 'product.sku',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SKU' />
    ),
    meta: {
      title: 'SKU',
    },
  },
  {
    accessorKey: 'inboundDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày nhập kho' />
    ),
    cell: ({ row }) =>
      new Date(row.original.inboundDate).toLocaleDateString('vi-VN'),
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
      title: 'Ngày nhập kho',
      type: 'date',
    },
  },
  {
    accessorKey: 'expDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Hạn sử dụng' />
    ),
    cell: ({ row }) => {
      return <ExpireDateUI expDate={row.original.expDate} />;
    },
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
      title: 'Hạn sử dụng',
      type: 'date',
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nhập từ phiếu' />
    ),
    meta: {
      title: 'Nhập từ phiếu',
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
