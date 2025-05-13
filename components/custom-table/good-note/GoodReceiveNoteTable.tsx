'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { GoodNote } from '@/types/goodNote';
import {
  useCurrentWarehouseGoodReceiveNotes,
  useGoodReceiveNotes,
} from '@/hooks/queries/goodNoteQueries';
import { Link, usePathname } from '@/lib/i18n/routing';
import { Button } from '../../shadcn-base/Button';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { ViewGoodNoteDialog } from '@/components/dialogs/ViewGoodNoteDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';
import CreatedByUI from '@/components/app/CreatedByUI';

export const columns: ColumnDef<GoodNote>[] = [
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
    cell: ({ row }) =>
      new Date(row.getValue('date')).toLocaleDateString('vi-VN'),
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
    accessorKey: 'goodRequest.requestedWarehouse.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kho nhận' />
    ),
    meta: {
      title: 'Kho nhận',
    },
  },
  {
    accessorKey: 'goodRequest.code',
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
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Trạng thái' />
  //   ),
  //   cell: ({ row }) => {
  //     return <StatusUI status={row.getValue('status')} />;
  //   },
  //   filterFn: statusFilterFn,
  //   meta: {
  //     title: 'Trạng thái',
  //   },
  // },
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
    cell: ({ row }) => (
      <div className='flex space-x-1 items-center'>
        {/* <Link href={`receipt/${row.original.id}`} className='flex items-center'>
          {row.original.status?.toString() === '0' && (
            <Tooltip>
              <TooltipTrigger>
                <Edit className='text-yellow-500' size={20} />
              </TooltipTrigger>
              <TooltipContent>Sửa</TooltipContent>
            </Tooltip>
          )}
        </Link> */}
        <Tooltip>
          <TooltipTrigger>
            <ViewGoodNoteDialog goodNote={row.original} />
          </TooltipTrigger>
          <TooltipContent>Chi tiết</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];

interface GoodReceiveNoteTableProps {
  onlyCurrentWarehouse?: boolean;
}

const GoodReceiveNoteTable: React.FC<GoodReceiveNoteTableProps> = ({
  onlyCurrentWarehouse = false,
}) => {
  const pathname = usePathname();
  const currentWarehouse = useCurrentWarehouse();

  const { data, isSuccess } = useGoodReceiveNotes(
    !onlyCurrentWarehouse && currentWarehouse?.id !== undefined
  );
  const { data: currentWarehouseData, isSuccess: isCurrentWarehouseSuccess } =
    useCurrentWarehouseGoodReceiveNotes(
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

export default GoodReceiveNoteTable;
