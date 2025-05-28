'use client';

import { statusFilterFn } from '@/lib/tanstack-table/customFilterFn';
import { cn } from '@/lib/utils/utils';
import { getAccountTasks } from '@/services/accountService';
import { ColumnDef } from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import CreatedByUI from '@/components/app/CreatedByUI';
import { Button } from '../../shadcn-base/Button';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import StatusStepper from './StatusStepper';

export interface AccountTask {
  id: string;
  status: number;
  expectedQuantity: number;
  countedQuantity: number;
  note: string;
  accountId: string;
  inventoryId: string;
  batchId: string;
  batchCode: string;
  productName: string;
  createdBy: string;
  createdTime: string;
  createdByAvatarUrl: string;
  createdByFullName: string;
  createdByGroup: string;
}

const columns: ColumnDef<AccountTask>[] = [
  {
    id: 'stt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='STT' className='text-xs' />
    ),
    cell: ({ row }) => row.index + 1,
    meta: { title: 'STT' },
  },
  {
    accessorKey: 'productName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sản phẩm' />
    ),
    cell: ({ row }) => row.getValue('productName') || 'N/A',
    meta: { title: 'Sản phẩm' },
  },
  {
    accessorKey: 'batchCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lô hàng' />
    ),
    cell: ({ row }) => row.getValue('batchCode') || 'N/A',
    meta: { title: 'Lô hàng' },
  },
  // {
  //   accessorKey: 'expectedQuantity',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='SL dự kiến' />
  //   ),
  //   cell: ({ row }) => row.getValue('expectedQuantity') ?? 0,
  //   meta: { title: 'SL dự kiến' },
  // },
  // {
  //   accessorKey: 'countedQuantity',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='SL thực tế' />
  //   ),
  //   cell: ({ row }) => row.getValue('countedQuantity') ?? 0,
  //   meta: { title: 'SL thực tế' },
  // },
  {
    accessorKey: 'note',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ghi chú' />
    ),
    cell: ({ row }) => row.getValue('note') || '—',
    meta: { title: 'Ghi chú' },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Trạng thái' />
    ),
    cell: ({ row }) => (
      <StatusStepper
        status={row.original.status}
        inventoryCounts={row.original}
      />
    ),
    filterFn: statusFilterFn,
    meta: { title: 'Trạng thái' },
  },
  {
    id: 'createdBy',
    accessorFn: ({ createdByFullName }) => createdByFullName || 'Người bí ẩn',
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
    meta: { title: 'Tạo bởi' },
  },
  {
    accessorKey: 'createdTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày tạo' />
    ),
    cell: ({ row }) => {
      const createdTime = row.getValue('createdTime') as string;
      if (!createdTime) return 'N/A';
      const [datePart, timePart] = createdTime.split(' ');
      const [day, month, year] = datePart.split('/');
      const formattedDate = new Date(`${year}-${month}-${day}T${timePart}`);
      return formattedDate.toLocaleString('vi-VN');
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue?.from && !filterValue?.to) return true;
      const createdTime = row.getValue(columnId) as string;
      if (!createdTime) return false;

      const [datePart, timePart] = createdTime.split(' ');
      const [day, month, year] = datePart.split('/');
      const rowDate = new Date(`${year}-${month}-${day}T${timePart}`);

      const fromDate = filterValue.from ? new Date(filterValue.from) : null;
      const toDate = filterValue.to ? new Date(filterValue.to) : null;
      if (toDate) toDate.setHours(23, 59, 59, 999);

      if (fromDate && toDate) return rowDate >= fromDate && rowDate <= toDate;
      if (fromDate) return rowDate >= fromDate;
      if (toDate) return rowDate <= toDate;

      return true;
    },
    meta: { title: 'Ngày tạo', type: 'date' },
  },
];

const AccountTaskTable = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tasks, setTasks] = useState<AccountTask[]>([]);

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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const result = await getAccountTasks();
        const taskArray = Array.isArray(result) ? result : result?.tasks ?? [];
        setTasks(taskArray);
      } catch (error) {
        console.error('Lỗi khi lấy tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((t) =>
    statusParams.length === 0 ? true : statusParams.includes(t.status)
  );

  return (
    <CustomDataTable columns={columns} data={filteredTasks}>
      <div className='w-full flex justify-between items-center mb-4'>
        <div className='space-x-2'>
          <Button
            onClick={selectAllStatuses}
            className={cn(
              'rounded-3xl border-2 text-blue-500 border-blue-500',
              statusParams.length === 0
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white hover:bg-slate-50'
            )}
          >
            Tất cả
          </Button>
          <Button
            onClick={() => toggleStatusFilter(2)}
            className={cn(
              'rounded-3xl border-2 text-red-500 border-red-500',
              statusParams.includes(2)
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white hover:bg-slate-50'
            )}
          >
            Chưa kiểm kê
          </Button>
          <Button
            onClick={() => toggleStatusFilter(0)}
            className={cn(
              'rounded-3xl border-2 text-yellow-500 border-yellow-500',
              statusParams.includes(0)
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-white hover:bg-slate-50'
            )}
          >
            Đã kiểm kê
          </Button>
          <Button
            onClick={() => toggleStatusFilter(1)}
            className={cn(
              'rounded-3xl border-2 text-green-400 border-green-400',
              statusParams.includes(1)
                ? 'bg-green-400 text-white hover:bg-green-500'
                : 'bg-white hover:bg-slate-50'
            )}
          >
            Đã cân bằng
          </Button>
        </div>
        {/* <Link href={`${pathname}/create`}>
          <Button className='bg-blue-600 text-white hover:bg-blue-700 rounded-lg'>
            Thêm
          </Button>
        </Link> */}
      </div>
    </CustomDataTable>
  );
};

export default AccountTaskTable;
