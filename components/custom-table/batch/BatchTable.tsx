'use client';
import CreatedByUI from '@/components/app/CreatedByUI';
import ViewBatchDialog from '@/components/dialogs/ViewBatchDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';
import { useBatches } from '@/hooks/queries/batchQueries';
import { Link, usePathname } from '@/lib/i18n/routing';
import { Batch } from '@/types/batch';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../../shadcn-base/Button';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';

export const columns: ColumnDef<Batch>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mã phiếu' />
    ),
    meta: { title: 'Mã phiếu' },
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
      if (toDate) toDate.setHours(23, 59, 59, 999);
      if (fromDate && toDate) return rowDate >= fromDate && rowDate <= toDate;
      if (fromDate) return rowDate >= fromDate;
      if (toDate) return rowDate <= toDate;
      return true;
    },
    meta: { title: 'Ngày thực hiện', type: 'date' },
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
      if (toDate) toDate.setHours(23, 59, 59, 999);
      if (fromDate && toDate) return rowDate >= fromDate && rowDate <= toDate;
      if (fromDate) return rowDate >= fromDate;
      if (toDate) return rowDate <= toDate;
      return true;
    },
    meta: { title: 'Ngày tạo', type: 'date' },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên lô' />
    ),
    meta: { title: 'Tên lô' },
  },
  {
    accessorKey: 'productId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID Sản phẩm' />
    ),
    meta: { title: 'ID Sản phẩm' },
  },
  {
    accessorKey: 'productName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên sản phẩm' />
    ),
    meta: { title: 'Tên sản phẩm' },
  },
  {
    accessorKey: 'inboundDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày nhập' />
    ),
    cell: ({ row }) =>
      new Date(row.getValue('inboundDate')).toLocaleDateString('vi-VN'),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue?.from && !filterValue?.to) return true;
      const rowDate = new Date(row.getValue(columnId));
      const fromDate = filterValue.from ? new Date(filterValue.from) : null;
      const toDate = filterValue.to ? new Date(filterValue.to) : null;
      if (toDate) toDate.setHours(23, 59, 59, 999);
      if (fromDate && toDate) return rowDate >= fromDate && rowDate <= toDate;
      if (fromDate) return rowDate >= fromDate;
      if (toDate) return rowDate <= toDate;
      return true;
    },
    meta: { title: 'Ngày nhập', type: 'date' },
  },
  {
    accessorKey: 'mfgDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='NSX' />
    ),
    cell: ({ row }) =>
      new Date(row.getValue('mfgDate')).toLocaleDateString('vi-VN'),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue?.from && !filterValue?.to) return true;
      const rowDate = new Date(row.getValue(columnId));
      const fromDate = filterValue.from ? new Date(filterValue.from) : null;
      const toDate = filterValue.to ? new Date(filterValue.to) : null;
      if (toDate) toDate.setHours(23, 59, 59, 999);
      if (fromDate && toDate) return rowDate >= fromDate && rowDate <= toDate;
      if (fromDate) return rowDate >= fromDate;
      if (toDate) return rowDate <= toDate;
      return true;
    },
    meta: { title: 'NSX', type: 'date' },
  },
  {
    accessorKey: 'expDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='HSD' />
    ),
    cell: ({ row }) =>
      new Date(row.getValue('expDate')).toLocaleDateString('vi-VN'),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue?.from && !filterValue?.to) return true;
      const rowDate = new Date(row.getValue(columnId));
      const fromDate = filterValue.from ? new Date(filterValue.from) : null;
      const toDate = filterValue.to ? new Date(filterValue.to) : null;
      if (toDate) toDate.setHours(23, 59, 59, 999);
      if (fromDate && toDate) return rowDate >= fromDate && rowDate <= toDate;
      if (fromDate) return rowDate >= fromDate;
      if (toDate) return rowDate <= toDate;
      return true;
    },
    meta: { title: 'HSD', type: 'date' },
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
  // {
  //   accessorKey: 'createdByGroup',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Nhóm người tạo' />
  //   ),
  //   cell: ({ row }) => (
  //     <CreatedByUI
  //       fullName={row.original.createdByFullName || 'Ware Ease'}
  //       group={row.original.createdByGroup || 'Hệ thống'}
  //       avatarUrl={
  //         row.original.createdByAvatarUrl || 'https://github.com/shadcn.png'
  //       }
  //     />
  //   ),
  //   meta: { title: 'Nhóm người tạo' },
  // },

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
        <Tooltip>
          <TooltipTrigger>
            <ViewBatchDialog batch={row.original} />
          </TooltipTrigger>
          <TooltipContent>Chi tiếttiết</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            {/* <UpdateBatchDialog batch={row.original} /> */}
          </TooltipTrigger>
          <TooltipContent>Sửa</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];

const BatchTable = () => {
  const pathname = usePathname();
  const { data, isSuccess } = useBatches();
  console.log(data);

  return (
    <CustomDataTable columns={columns} data={isSuccess ? data : []}>
      <Link href={`${pathname}/create`}>
        <Button>Thêm</Button>
      </Link>
    </CustomDataTable>
  );
};

export default BatchTable;
