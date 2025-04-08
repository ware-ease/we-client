'use client';
import { useInventoryCounts } from '@/hooks/queries/inventoryCountQueries';
import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
import { Link, usePathname } from '@/lib/i18n/routing';
import { InventoryCount } from '@/types/inventoryCount';
import { ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';
import React from 'react';
import { Button } from '../../shadcn-base/Button';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';

export const columns: ColumnDef<InventoryCount>[] = [
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
      <DataTableColumnHeader column={column} title='Mã số' />
    ),
    meta: {
      title: 'Mã số',
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Thời điểm kiểm kê' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('date') as string;
      const startTime = row.original.startTime;
      if (!date) return 'N/A';
      const dateTime = new Date(date);
      if (startTime) {
        const [hours, minutes] = startTime.split(':');
        dateTime.setHours(parseInt(hours), parseInt(minutes));
      }
      return dateTime.toLocaleString('vi-VN');
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue?.from && !filterValue?.to) return true;
      const rowDate = new Date(row.getValue(columnId));
      const startTime = row.original.startTime;
      if (startTime) {
        const [hours, minutes] = startTime.split(':');
        rowDate.setHours(parseInt(hours), parseInt(minutes));
      }
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
      title: 'Thời điểm kiểm kê',
      type: 'date',
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A';
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const status = row.getValue(columnId) as string;
      return status?.toLowerCase().includes(filterValue.toLowerCase());
    },
    meta: {
      title: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
      ],
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vị trí' />
    ),
    cell: ({ row }) => row.getValue('location') || 'N/A',
    meta: {
      title: 'Vị trí',
    },
  },
  {
    accessorKey: 'note',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ghi chú' />
    ),
    cell: ({ row }) => row.getValue('note') || 'N/A',
    meta: {
      title: 'Ghi chú',
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày tạo' />
    ),
    cell: ({ row }) =>
      new Date(row.getValue('createdAt')).toLocaleString('vi-VN'),
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
        <Link href={`inventory-count/${row.original.id}`}>
          <Edit className='text-yellow-500' size={20} />
        </Link>
      </div>
    ),
  },
];

interface InventoryCountTableProps {
  onlyCurrentWarehouse?: boolean;
}

const InventoryCountTable: React.FC<InventoryCountTableProps> = ({
  onlyCurrentWarehouse = false,
}) => {
  const pathname = usePathname();
  const currentWarehouse = useCurrentWarehouse();

  // Fetch all inventory counts (when not limited to current warehouse)
  const { data, isSuccess } = useInventoryCounts(
    !onlyCurrentWarehouse && currentWarehouse?.id !== undefined // enabled
  );

  // Fetch inventory counts for the current warehouse
  const { data: currentWarehouseData, isSuccess: isCurrentWarehouseSuccess } =
    useInventoryCounts(
      onlyCurrentWarehouse && currentWarehouse?.id !== undefined, // enabled
      currentWarehouse?.id
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

export default InventoryCountTable;
