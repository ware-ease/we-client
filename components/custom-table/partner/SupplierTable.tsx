'use client';
import UpdateSupplierDialog from '@/components/dialogs/UpdateSupplierDialog';
import ViewSupplierDialog from '@/components/dialogs/ViewSupplierDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';
import { useSuppliers } from '@/hooks/queries/supplierQueries';
import { Supplier } from '@/types/supplier';
import { ColumnDef } from '@tanstack/react-table';
import AddSupplierDialog from '../../dialogs/AddSupplierDialog';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';

export const columns: ColumnDef<Supplier>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên' />
    ),
    meta: {
      title: 'Tên',
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số điện thoại' />
    ),
    meta: {
      title: 'Số điện thoại',
    },
  },
  // {
  //   accessorKey: 'email',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Email' />
  //   ),
  //   meta: {
  //     title: 'Email',
  //   },
  // },
  // {
  //   accessorKey: 'address',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Địa chỉ' />
  //   ),
  //   meta: {
  //     title: 'Địa chỉ',
  //   },
  // },
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Trạng thái' />
  //   ),
  //   cell: ({ row }) => {
  //     const status = row.getValue('status');
  //     return (
  //       <span
  //         className={`bg-${
  //           status ? 'green-500' : 'red-500'
  //         } font-medium text-white flex items-center justify-center rounded-xl py-1 text-xs`}
  //       >
  //         {status ? 'Đang hoạt động' : 'Ngưng hoạt động'}
  //       </span>
  //     );
  //   },
  //   meta: {
  //     title: 'Trạng thái',
  //   },
  // },
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
        <Tooltip>
          <TooltipTrigger>
            <ViewSupplierDialog supplier={row.original} />
          </TooltipTrigger>
          <TooltipContent>Chi tiết</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <UpdateSupplierDialog supplier={row.original} />
          </TooltipTrigger>
          <TooltipContent>Sửa</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];

const SupplierTable = () => {
  const { data, isSuccess } = useSuppliers();
  // console.log(data);

  return (
    <CustomDataTable columns={columns} data={isSuccess ? data : []}>
      <AddSupplierDialog />
    </CustomDataTable>
  );
};

export default SupplierTable;
