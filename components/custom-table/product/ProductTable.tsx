'use client';
import ViewProductDialog from '@/components/dialogs/ViewProductDialog';
import { useProducts } from '@/hooks/queries/productQueries';
import { Product } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';
import { Check, Edit, X } from 'lucide-react';
import AddProductDialog from '../../dialogs/AddProductDialog';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: 'sku',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SKU' />
    ),
    meta: {
      title: 'SKU',
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên sản phẩm' />
    ),
    meta: {
      title: 'Tên',
    },
  },
  {
    accessorKey: 'brand',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Hãng' />
    ),
    meta: {
      title: 'Hãng',
    },
  },
  {
    accessorKey: 'productType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Loại' />
    ),
    meta: {
      title: 'Loại',
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Danh mục' />
    ),
    meta: {
      title: 'Danh mục',
    },
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Đơn vị' />
    ),
    meta: {
      title: 'Đơn vị',
    },
  },
  {
    accessorKey: 'isBatchManaged',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Theo lô' />
    ),
    cell: ({ row }) => {
      return (
        <div>
          {row.original.isBatchManaged ? (
            <Check className='text-green-500' size={20} />
          ) : (
            <X className='text-red-500' size={20} />
          )}
        </div>
      );
    },
    meta: {
      title: 'Theo lô',
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
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className='flex space-x-2'>
          <Tooltip>
            <TooltipTrigger>
              <Edit className='text-yellow-500 cursor-pointer' size={20} />
            </TooltipTrigger>
            <TooltipContent>Sửa</TooltipContent>
          </Tooltip>
          {/* <ProductDeleteButton productId={row.getValue('id')} /> */}
          <Tooltip>
            <TooltipTrigger>
              <ViewProductDialog product={product} />
            </TooltipTrigger>
            <TooltipContent>Chi tiết</TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];

const ProductTable = () => {
  const { data, isSuccess } = useProducts();

  return (
    <CustomDataTable columns={columns} data={isSuccess ? data : []}>
      <AddProductDialog />
    </CustomDataTable>
  );
};

export default ProductTable;
