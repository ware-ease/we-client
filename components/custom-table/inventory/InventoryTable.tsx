'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { Link } from '@/lib/i18n/routing';
import { Button } from '../../shadcn-base/Button';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { useWarehousesInventories } from '@/hooks/queries/warehouseQueries'; // Assuming this exists
import { Inventory } from '@/types/warehouse';
import { View } from 'lucide-react';

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
          <View className='text-blue-500' size={20} />
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
  const currentWarehouse = useCurrentWarehouse();

  // Fetch inventory data using useWarehousesInventories
  const { data, isSuccess } = useWarehousesInventories(
    true, // Assuming first param enables the query
    onlyCurrentWarehouse && currentWarehouse?.id ? currentWarehouse.id : '' // Pass warehouseId based on onlyCurrentWarehouse
  );

  const tableData = isSuccess && data.inventories ? data.inventories : [];

  return (
    <CustomDataTable columns={columns} data={tableData}>
      <Link href={'inventories/adjustment'} className='mr-2'>
        <Button>Điều chỉnh tồn kho</Button>
      </Link>
    </CustomDataTable>
  );
};

export default InventoryTable;
