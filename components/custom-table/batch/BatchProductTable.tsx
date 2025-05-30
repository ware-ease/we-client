'use client';

import ViewInventoryDialog from '@/components/dialogs/ViewInventoryDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';
import { Inventory } from '@/types/warehouse';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';

export const columns: ColumnDef<Inventory>[] = [
  {
    accessorKey: 'batch.code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mã lô' />
    ),
    meta: {
      title: 'Mã lô',
    },
  },
  {
    accessorKey: 'batch.inboundDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày nhập kho' />
    ),
    cell: ({ row }) =>
      new Date(row.original.batch.inboundDate).toLocaleDateString('vi-VN'),
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
    accessorKey: 'batch.expDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Hạn sử dụng' />
    ),
    cell: ({ row }) => {
      return new Date(row.original.batch.expDate) > new Date('01/01/0001')
        ? new Date(row.original.batch.expDate).toLocaleDateString('vi-VN')
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
    accessorKey: 'batch.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nhập từ phiếu' />
    ),
    meta: {
      title: 'Nhập từ phiếu',
    },
  },
  {
    accessorKey: 'currentQuantity',
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
  {
    id: 'crud-actions',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Hành động'
        className='text-xs'
      />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-2 items-center'>
        <Tooltip>
          <TooltipTrigger>
            <ViewInventoryDialog inventory={row.original} />
          </TooltipTrigger>
          <TooltipContent>Chi tiết</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];

const ProductBatchTable: React.FC<{ inventories: Inventory[] }> = ({
  inventories,
}) => {
  return (
    <CustomDataTable columns={columns} data={inventories}></CustomDataTable>
  );
};

export default ProductBatchTable;
