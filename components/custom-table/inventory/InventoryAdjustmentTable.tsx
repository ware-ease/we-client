'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { Link } from '@/lib/i18n/routing';
import { Button } from '../../shadcn-base/Button';
import { useWarehouseInventoryAdjustments } from '@/hooks/queries/warehouseQueries'; // Assuming this exists
import { InventoryAdjustment } from '@/types/warehouse';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';
import CreatedByUI from '@/components/app/CreatedByUI';
import { ViewAdjustmentDialog } from '@/components/dialogs/ViewAdjustmentDialog';
import { useSearchParams } from 'next/navigation';

export const columns: ColumnDef<InventoryAdjustment>[] = [
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
    accessorKey: 'warehouseName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kho điều chỉnh' />
    ),
    meta: {
      title: 'Kho điều chỉnh',
    },
  },
  {
    accessorKey: 'reason',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lí do' />
    ),
    meta: {
      title: 'Lí do',
    },
  },
  {
    accessorKey: 'relatedDocument',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Chứng từ liên quan' />
    ),
    meta: {
      title: 'Chứng từ liên quan',
    },
  },
  {
    accessorKey: 'note',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ghi chú' />
    ),
    meta: {
      title: 'Ghi chú',
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
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Hành động'
        className='text-xs'
      />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-1 items-center'>
        <Tooltip>
          <TooltipTrigger>
            <ViewAdjustmentDialog adjustment={row.original} />
          </TooltipTrigger>
          <TooltipContent>Chi tiết</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];

interface InventoryAdjustmentTableProps {
  onlyCurrentWarehouse?: boolean;
}

const InventoryAdjustmentTable: React.FC<InventoryAdjustmentTableProps> = ({
  onlyCurrentWarehouse = false,
}) => {
  const searchParams = useSearchParams();

  // Fetch inventory data using useWarehousesInventories
  const { data } = useWarehouseInventoryAdjustments(
    true, // Assuming first param enables the query
    onlyCurrentWarehouse ? (searchParams.get('warehouseId') as string) : '' // Pass warehouseId based on onlyCurrentWarehouse
  );

  return (
    <CustomDataTable columns={columns} data={data || []}>
      <Link href={'adjustment/create'}>
        <Button>Điều chỉnh</Button>
      </Link>
    </CustomDataTable>
  );
};

export default InventoryAdjustmentTable;
