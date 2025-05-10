'use client';
import AddCustomerDialog from '@/components/dialogs/AddCustomerDialog';
import UpdateCustomerDialog from '@/components/dialogs/UpdateCustomerDialog';
import ViewCustomerDialog from '@/components/dialogs/ViewCustomerDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';
import { useCustomers } from '@/hooks/queries/customerQueries';
import { Customer } from '@/types/customer';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';

export const columns: ColumnDef<Customer>[] = [
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
            <ViewCustomerDialog customer={row.original} />
          </TooltipTrigger>
          <TooltipContent>Xem</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <UpdateCustomerDialog customer={row.original} />
          </TooltipTrigger>
          <TooltipContent>Sửa</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];

const CustomerTable = () => {
  const { data, isSuccess } = useCustomers();
  console.log(data);

  return (
    <CustomDataTable columns={columns} data={isSuccess ? data : []}>
      <AddCustomerDialog />
    </CustomDataTable>
  );
};

export default CustomerTable;
