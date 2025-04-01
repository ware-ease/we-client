'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { Edit } from 'lucide-react';
import { GoodRequest } from '@/types/goodRequest';
import { useGoodRequests } from '@/hooks/queries/goodRequests';
import { Link, usePathname } from '@/lib/i18n/routing';
import { Button } from '../../shadcn-base/Button';
import StatusUI from '@/components/app/StatusUI';
import { statusFilterFn } from '@/lib/tanstack-table/customFilterFn';

export const columns: ColumnDef<GoodRequest>[] = [
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
      <DataTableColumnHeader column={column} title='Mã yêu cầu' />
    ),
    meta: {
      title: 'Mã yêu cầu',
    },
  },
  {
    accessorKey: 'requestType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Loại yêu cầu' />
    ),
    cell: ({ row }) => {
      const type = row.original.requestType;
      switch (type) {
        case 0:
          return <div className='text-blue-500 font-medium'>Nhập</div>;
        case 1:
          return <div className='text-orange-500 font-medium'>Xuất</div>;
        case 2:
          return <div className='text-yellow-500 font-medium'>Chuyển</div>;
        case 3:
          return <div className='text-red-500 font-medium'>Trả hàng</div>;
        default:
          return (
            <div className='text-gray-400 font-medium'>Không xác định</div>
          );
      }
    },
    meta: {
      title: 'Loại yêu cầu',
    },
  },
  {
    accessorKey: 'partnerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Đối tác' />
    ),
    meta: {
      title: 'Đối tác',
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
    accessorKey: 'warehouseName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kho yêu cầu' />
    ),
    meta: {
      title: 'Kho yêu cầu',
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => {
      return <StatusUI status={row.getValue('status')} />;
    },
    filterFn: statusFilterFn,
    meta: {
      title: 'Trạng thái',
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
      <Link href={`requests/${row.original.id}`} className='flex space-x-2'>
        {row.original.status?.toString() === '0' && (
          <Edit className='text-yellow-500' size={20} />
        )}
      </Link>
    ),
  },
];

const GoodRequestTable = () => {
  const pathname = usePathname();
  const { data, isSuccess } = useGoodRequests();

  return (
    <CustomDataTable columns={columns} data={isSuccess ? data : []}>
      <Link href={`${pathname}/create`}>
        <Button>Thêm</Button>
      </Link>
    </CustomDataTable>
  );
};

export default GoodRequestTable;
