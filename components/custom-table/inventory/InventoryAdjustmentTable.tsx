'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { Link } from '@/lib/i18n/routing';
import { Button } from '../../shadcn-base/Button';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { useWarehouseInventoryAdjustments } from '@/hooks/queries/warehouseQueries'; // Assuming this exists
import { Inventory } from '@/types/warehouse';
import { Eye } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';

export const columns: ColumnDef<Inventory>[] = [
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
    accessorKey: 'warehouse.name',
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
        {/* Add actions like view or edit if needed */}
        <Link href={`inventories/adjustments/${row.original.id}`}>
          <Tooltip>
            <TooltipTrigger>
              <Eye className='text-blue-500' size={20} />
            </TooltipTrigger>
            <TooltipContent>Chi tiết</TooltipContent>
          </Tooltip>
        </Link>
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
  const currentWarehouse = useCurrentWarehouse();

  // Fetch inventory data using useWarehousesInventories
  const { data, isSuccess } = useWarehouseInventoryAdjustments(
    true, // Assuming first param enables the query
    onlyCurrentWarehouse && currentWarehouse?.id ? currentWarehouse.id : '' // Pass warehouseId based on onlyCurrentWarehouse
  );

  const tableData = isSuccess && data.inventories ? data.inventories : [];

  return (
    <CustomDataTable columns={columns} data={tableData}>
      <Link href={'inventories/adjustment/create'} className='mr-2'>
        <Button>Điều chỉnh</Button>
      </Link>
    </CustomDataTable>
  );
};

export default InventoryAdjustmentTable;
