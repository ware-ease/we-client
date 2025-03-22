'use client';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { Edit } from 'lucide-react';
import AddProductDialog from '../../dialogs/AddProductDialog';
import { GoodRequest } from '@/lib/types/goodRequest';
import { useGoodRequests } from '@/lib/hooks/queries/goodRequests';

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
      const type = row.getValue('requestType');
      switch (type) {
        case 0:
          return <div className='text-blue-500 font-medium'>Nhập</div>;
        case 1:
          return <div className='text-blue-500 font-medium'>Xuất</div>;
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: ({ row }) => (
      <div className='flex space-x-2'>
        {/* Gắn nút mở dialog Edit/Delete rồi dùng {row.getValue('id')} để truyền id vào */}
        <Edit className='text-yellow-500' size={20} />
        {/* <ProductDeleteButton productId={row.getValue('id')} /> */}
      </div>
    ),
  },
];

const GoodRequestTable = () => {
  const { data, isSuccess } = useGoodRequests();

  return (
    <CustomDataTable columns={columns} data={isSuccess ? data : []}>
      <AddProductDialog />
    </CustomDataTable>
  );
};

export default GoodRequestTable;
