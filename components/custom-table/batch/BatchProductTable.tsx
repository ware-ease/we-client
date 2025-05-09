'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { Batch } from '@/types/batch';

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
      <DataTableColumnHeader column={column} title='Mã lô' />
    ),
    meta: {
      title: 'Mã lô',
    },
  },
  {
    accessorKey: 'inboundDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày nhập kho' />
    ),
    cell: ({ row }) =>
      new Date(row.getValue('inboundDate')).toLocaleDateString('vi-VN'),
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
      return new Date(row.getValue('expDate')) > new Date('01/01/0001')
        ? new Date(row.getValue('expDate')).toLocaleDateString('vi-VN')
        : 'Không có';
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
    accessorKey: 'thisWarehouseQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Số lượng trong kho hiện tại'
      />
    ),
    meta: {
      title: 'Số lượng trong kho hiện tại',
    },
  },
];

const ProductBatchTable: React.FC<{ batches: Batch[] }> = ({ batches }) => {
  return <CustomDataTable columns={columns} data={batches}></CustomDataTable>;
};

export default ProductBatchTable;
