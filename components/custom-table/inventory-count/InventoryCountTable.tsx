'use client';
// import { ViewInventoryCountDialog } from '@/components/dialogs/ViewInventoryCountDialog';
import { useInventoryCounts } from '@/hooks/queries/inventoryCountQueries';
// import { useCurrentWarehouse } from '@/hooks/useCurrentWarehouse';
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
    accessorKey: 'checkTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Thời điểm kiểm kê' />
    ),
    cell: ({ row }) =>
      new Date(row.getValue('checkTime')).toLocaleString('vi-VN'),
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
      title: 'Thời điểm kiểm kê',
      type: 'date',
    },
  },
  {
    accessorKey: 'inspector',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Người kiểm kê' />
    ),
    meta: {
      title: 'Người kiểm kê',
    },
  },
  {
    accessorKey: 'position',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Chức vụ' />
    ),
    meta: {
      title: 'Chức vụ',
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
        {/* <ViewInventoryCountDialog inventoryCount={row.original} /> */}
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
  //   const currentWarehouse = useCurrentWarehouse();

  // Sử dụng hook để lấy tất cả inventory counts
  const { data, isSuccess } = useInventoryCounts();
  // !onlyCurrentWarehouse && currentWarehouse?.id !== undefined

  // Giả định bạn có hook để lấy inventory counts theo kho hiện tại
  const { data: currentWarehouseData, isSuccess: isCurrentWarehouseSuccess } =
    useInventoryCounts();
  //   onlyCurrentWarehouse && currentWarehouse?.id !== undefined,
  //   currentWarehouse?.id ?? ''

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
