'use client';
import StatusUI from '@/components/app/StatusUI';
import { useInventoryCounts } from '@/hooks/queries/inventoryCountQueries';
import { Link, usePathname, useRouter } from '@/lib/i18n/routing';
import { statusFilterFn } from '@/lib/tanstack-table/customFilterFn';
import { cn } from '@/lib/utils/utils';
import { InventoryCount } from '@/types/inventoryCount';
import { ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Trạng thái'
        // className='text-center'
      />
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

//////////////////////////////////////////////
const InventoryCountTable = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse status params as an array
  const statusParams = searchParams.get('status')
    ? searchParams.get('status')!.split(',').map(Number)
    : [];

  const toggleStatusFilter = (status: number) => {
    const newStatuses = statusParams.includes(status)
      ? statusParams.filter((s) => s !== status)
      : [...statusParams, status];

    const params = new URLSearchParams(searchParams.toString());

    if (newStatuses.length > 0) {
      params.set('status', newStatuses.join(','));
    } else {
      params.delete('status');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const selectAllStatuses = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('status');
    router.push(`${pathname}?${params.toString()}`);
  };

  //const { warehouseId } = useParams();
  const { data: inventoryCounts, isSuccess } = useInventoryCounts(
    true
    //warehouseId
  );
  console.log(inventoryCounts);

  return (
    <CustomDataTable
      columns={columns}
      // meta={{ warehouseId: warehouseId?.toString() }}
      data={
        isSuccess
          ? inventoryCounts.filter((r) =>
              statusParams.length === 0
                ? true
                : statusParams.includes(r.status || 0)
            )
          : []
      }
    >
      <div className='w-full flex justify-between'>
        <div className='space-x-2'>
          <Button
            onClick={selectAllStatuses}
            className={cn(
              'rounded-3xl text-blue-500 border-2 border-blue-500',
              statusParams.length === 0
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white hover:bg-slate-50'
            )}
          >
            Tất cả
          </Button>
          <Button
            className={cn(
              'rounded-3xl text-yellow-500 border-2 border-yellow-500',
              statusParams.includes(0)
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-white hover:bg-slate-50'
            )}
            onClick={() => toggleStatusFilter(0)}
          >
            Chờ xử lý
          </Button>
          <Button
            className={cn(
              'rounded-3xl text-green-400 border-2 border-green-400',
              statusParams.includes(1)
                ? 'bg-green-400 text-white hover:bg-green-400'
                : 'bg-white hover:bg-slate-50'
            )}
            onClick={() => toggleStatusFilter(1)}
          >
            Đã đồng ý
          </Button>
          <Button
            className={cn(
              'rounded-3xl text-red-500 border-2 border-red-500',
              statusParams.includes(2)
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white hover:bg-slate-50'
            )}
            onClick={() => toggleStatusFilter(2)}
          >
            Đã từ chối
          </Button>
          <Button
            className={cn(
              'rounded-3xl text-green-500 border-2 border-green-500',
              statusParams.includes(3)
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-white hover:bg-slate-50'
            )}
            onClick={() => toggleStatusFilter(3)}
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

export default InventoryCountTable;
