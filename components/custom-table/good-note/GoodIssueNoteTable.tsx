'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { GoodNote } from '@/types/goodNote';
import {
  useCurrentWarehouseGoodIssueNotes,
  useGoodIssueNotes,
} from '@/hooks/queries/goodNoteQueries';
import { Link, usePathname } from '@/lib/i18n/routing';
import { Button } from '../../shadcn-base/Button';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';

export const columns: ColumnDef<GoodNote>[] = [
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

interface GoodIssueNoteTableProps {
  onlyCurrentWarehouse?: boolean;
}

const GoodIssueNoteTable: React.FC<GoodIssueNoteTableProps> = ({
  onlyCurrentWarehouse = false,
}) => {
  const pathname = usePathname();
  const currentWarehouse = useCurrentWarehouse();

  const { data, isSuccess } = useGoodIssueNotes(
    !onlyCurrentWarehouse && currentWarehouse?.id !== undefined
  );
  const { data: currentWarehouseData, isSuccess: isCurrentWarehouseSuccess } =
    useCurrentWarehouseGoodIssueNotes(
      onlyCurrentWarehouse && currentWarehouse?.id !== undefined,
      currentWarehouse?.id ?? ''
    );

  const tableData = onlyCurrentWarehouse
    ? isCurrentWarehouseSuccess
      ? currentWarehouseData
      : []
    : isSuccess
    ? data
    : [];

  return (
    <CustomDataTable columns={columns} data={tableData}>
      <Link href={`${pathname}/create`}>
        <Button>Thêm</Button>
      </Link>
    </CustomDataTable>
  );
};

export default GoodIssueNoteTable;
