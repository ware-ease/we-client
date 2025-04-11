'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { GoodRequest } from '@/types/goodRequest';
import { useGoodRequests } from '@/hooks/queries/goodRequests';
import { Link, usePathname, useRouter } from '@/lib/i18n/routing';
import { Button } from '../../shadcn-base/Button';
import StatusUI from '@/components/app/StatusUI';
import { statusFilterFn } from '@/lib/tanstack-table/customFilterFn';
import { ViewGoodRequestDialog } from '@/components/dialogs/ViewGoodRequestDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';
import { useParams, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils/utils';

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
    accessorKey: 'partner.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Đối tác' />
    ),
    meta: {
      title: 'Đối tác',
    },
  },
  {
    accessorKey: 'warehouse.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kho yêu cầu' />
    ),
    meta: {
      title: 'Kho yêu cầu',
    },
  },
  {
    accessorKey: 'requestedWarehouse.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kho nhận yêu cầu' />
    ),
    meta: {
      title: 'Kho nhận yêu cầu',
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
      <div className='flex space-x-1 items-center'>
        <Tooltip>
          <TooltipTrigger>
            <ViewGoodRequestDialog goodRequest={row.original} />
          </TooltipTrigger>
          <TooltipContent>Chi tiết</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];

const GoodRequestWarehouseTable = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const statusParam = searchParams.get('status');
  const statusFilter = statusParam !== null ? parseInt(statusParam) : null;

  const setStatusFilter = (status: number | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status === null) {
      params.delete('status');
    } else {
      params.set('status', status.toString());
    }

    router.push(`${pathname}?${params.toString()}`);
  };
  const { warehouseId } = useParams();
  const { data, isSuccess } = useGoodRequests();

  return (
    <CustomDataTable
      columns={columns}
      data={
        isSuccess
          ? data.filter(
              (r) =>
                (r.requestedWarehouseId === warehouseId ||
                  r.warehouseId === warehouseId) &&
                (statusFilter === null || r.status === statusFilter)
            )
          : []
      }
    >
      <div className='w-full flex justify-between'>
        <div className='space-x-2'>
          <Button
            onClick={() => setStatusFilter(null)}
            className={cn(
              'rounded-3xl text-blue-500 border-2 border-blue-500',
              statusFilter === null
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white hover:bg-slate-50'
            )}
          >
            Tất cả
          </Button>
          <Button
            className={cn(
              'rounded-3xl text-yellow-500 border-2 border-yellow-500',
              statusFilter === 0
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-white hover:bg-slate-50'
            )}
            onClick={() => setStatusFilter(0)}
          >
            Chờ xử lý
          </Button>
          <Button
            className={cn(
              'rounded-3xl text-green-500 border-2 border-green-500',
              statusFilter === 3
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-white hover:bg-slate-50'
            )}
            onClick={() => setStatusFilter(3)}
          >
            Hoàn thành
          </Button>
        </div>
        <Link href={`${pathname}/create`}>
          <Button>Thêm</Button>
        </Link>
      </div>
    </CustomDataTable>
  );
};

export default GoodRequestWarehouseTable;
