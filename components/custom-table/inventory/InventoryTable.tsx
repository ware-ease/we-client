'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { Link } from '@/lib/i18n/routing';
import { Button } from '../../shadcn-base/Button';
import { useWarehousesInventories } from '@/hooks/queries/warehouseQueries'; // Assuming this exists
import { Inventory } from '@/types/warehouse';
import { Eye } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';
import { useParams } from 'next/navigation';

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
    accessorKey: 'batch.product.sku',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mã sản phẩm' />
    ),
    meta: {
      title: 'Mã sản phẩm',
    },
  },
  {
    accessorKey: 'batch.product.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên sản phẩm' />
    ),
    meta: {
      title: 'Tên sản phẩm',
    },
  },
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
    accessorKey: 'batch.product.unitName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ĐVT' />
    ),
    meta: {
      title: 'ĐVT',
    },
  },
  {
    accessorKey: 'currentQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số lượng hiện tại' />
    ),
    cell: ({ row }) => row.original.currentQuantity.toLocaleString('vi-VN'), // Format number
    meta: {
      title: 'Số lượng hiện tại',
    },
  },
  {
    accessorKey: 'arrangedQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số lượng đã xếp' />
    ),
    cell: ({ row }) => row.original.arrangedQuantity, // Format number
    meta: {
      title: 'Số lượng đã xếp',
    },
  },
  {
    accessorKey: 'notArrgangedQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số lượng chưa xếp' />
    ),
    cell: ({ row }) => row.original.notArrgangedQuantity, // Format number
    meta: {
      title: 'Số lượng chưa xếp',
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
        <Link href={`inventories/${row.original.id}`}>
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

interface InventoryTableProps {
  onlyCurrentWarehouse?: boolean;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  onlyCurrentWarehouse = false,
}) => {
  const { warehouseId } = useParams();

  // Fetch inventory data using useWarehousesInventories
  const { data, isSuccess } = useWarehousesInventories(
    true, // Assuming first param enables the query
    onlyCurrentWarehouse && (warehouseId as string)
      ? (warehouseId as string)
      : '' // Pass warehouseId based on onlyCurrentWarehouse
  );

  const tableData = isSuccess && data.inventories ? data.inventories : [];

  return (
    <CustomDataTable columns={columns} data={tableData}>
      <Link href={'inventories/adjustment'}>
        <Button>Điều chỉnh tồn kho</Button>
      </Link>
    </CustomDataTable>
  );
};

export default InventoryTable;
