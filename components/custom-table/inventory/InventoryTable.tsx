'use client';
import ExpireDateUI from '@/components/app/ExpireDateUI';
import ViewBatchDialog from '@/components/dialogs/ViewBatchDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn-base/Tooltip';
import { useWarehousesInventories } from '@/hooks/queries/warehouseQueries'; // Assuming this exists
import { Link, usePathname, useRouter } from '@/lib/i18n/routing';
import { cn } from '@/lib/utils/utils';
import { Product } from '@/types/product';
import { Inventory } from '@/types/warehouse';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '../../shadcn-base/Button';
import { DataTableColumnHeader } from '../base-data-table/ColumnHeader';
import { CustomDataTable } from '../base-data-table/CustomDataTable';
import { CustomDataTable2 } from '../base-data-table/CustomDataTable2';

interface ProductsView {
  id: string;
  product?: Product;
  unitName: string;
  currentQuantity: number;
  productId?: string;
  warehouseId: string;
}

export const columns: ColumnDef<Inventory>[] = [
  {
    accessorKey: 'batch.product.sku',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mã sản phẩm' />
    ),
    meta: {
      title: 'Mã sản phẩm',
    },
  },
  {
    accessorKey: 'batch.product.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên sản phẩm' />
    ),
    meta: {
      title: 'Tên sản phẩm',
    },
  },
  {
    accessorKey: 'batch.code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mã lô' />
    ),
    meta: {
      title: 'Mã lô',
    },
  },
  {
    accessorKey: 'batch.inboundDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ngày nhập' />
    ),
    cell: ({ row }) =>
      new Date(row.original.batch.inboundDate).toLocaleDateString('vi-VN'),
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
      title: 'Ngày nhập',
      type: 'date',
    },
  },
  {
    accessorKey: 'batch.expDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Hạn sử dụng' />
    ),
    cell: ({ row }) => {
      return <ExpireDateUI expDate={row.original.batch.expDate} />;
    },
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
      title: 'Hạn sử dụng',
      type: 'date',
    },
  },
  {
    accessorKey: 'batch.product.unitName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ĐVT' />
    ),
    meta: {
      title: 'ĐVT',
    },
  },
  {
    accessorKey: 'currentQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số lượng hiện tại' />
    ),
    cell: ({ row }) => row.original.currentQuantity.toLocaleString('vi-VN'), // Format number
    meta: {
      title: 'Số lượng hiện tại',
    },
  },
  {
    id: 'actions',
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
            <ViewBatchDialog batch={row.original.batch} />
          </TooltipTrigger>
          <TooltipContent>Chi tiết</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];

export const productsColumns: ColumnDef<ProductsView>[] = [
  {
    accessorKey: 'product.sku',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mã sản phẩm' />
    ),
    meta: {
      title: 'Mã sản phẩm',
    },
  },
  {
    accessorKey: 'product.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tên sản phẩm' />
    ),
    meta: {
      title: 'Tên sản phẩm',
    },
  },
  {
    accessorKey: 'product.unitName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ĐVT' />
    ),
    meta: {
      title: 'ĐVT',
    },
  },
  {
    accessorKey: 'currentQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Số lượng hiện tại' />
    ),
    cell: ({ row }) => row.original.currentQuantity.toLocaleString('vi-VN'), // Format number
    meta: {
      title: 'Số lượng hiện tại',
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Hành động'
        className='text-xs'
      />
    ),
    cell: ({ row }) => (
      <div className='flex space-x-1 items-center'>
        {/* Add actions like view or edit if needed */}
        <Link
          href={`/products/${row.original.productId}?currentWarehouseId=${row.original.warehouseId}`}
        >
          <Tooltip>
            <TooltipTrigger>
              <Eye className='text-blue-500' size={20} />
            </TooltipTrigger>
            <TooltipContent>Chi tiết</TooltipContent>
          </Tooltip>
        </Link>
      </div>
    ),
  },
];

interface InventoryTableProps {
  onlyCurrentWarehouse?: boolean;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  onlyCurrentWarehouse = false,
}) => {
  const { warehouseId } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productsViewData, setProductViewData] = useState<ProductsView[]>([]);

  // Get view from URL (default to 'batches')
  const view = searchParams.get('view') || 'batches';

  // Fetch inventory data using useWarehousesInventories
  const { data: batchesViewData, isSuccess } = useWarehousesInventories(
    true, // Assuming first param enables the query
    onlyCurrentWarehouse && (warehouseId as string)
      ? (warehouseId as string)
      : '' // Pass warehouseId based on onlyCurrentWarehouse
  );

  useEffect(() => {
    const groupedProducts: ProductsView[] = [];
    batchesViewData?.inventories?.forEach((inv) => {
      const existed = groupedProducts.find(
        (gp) => gp.id === inv.batch.product?.sku
      );
      if (existed) {
        groupedProducts.find(
          (gp) => gp.id === inv.batch.product?.sku
        )!.currentQuantity += inv.currentQuantity;
      } else {
        groupedProducts.push({
          id: inv.batch.product?.sku || '',
          product: inv.batch.product,
          productId: inv.batch.productId,
          unitName: inv.batch.product?.unitName || '',
          currentQuantity: inv.currentQuantity,
          warehouseId: warehouseId as string,
        });
      }
    });

    setProductViewData(groupedProducts);
  }, [batchesViewData]);

  const setViewFilter = (newView: 'batches' | 'products') => {
    router.push(`${pathname}?view=${newView}`);
  };

  const tableData =
    isSuccess && batchesViewData.inventories ? batchesViewData.inventories : [];

  return view === 'batches' ? (
    <CustomDataTable
      columns={columns}
      data={tableData.toSorted((a, b) => {
        return a.batch.expDate < b.batch.expDate ? -1 : 1;
      })}
    >
      <div className='w-full flex justify-between'>
        <div className='space-x-2'>
          <Button
            className={cn(
              'rounded-3xl text-blue-500 border-2 border-blue-500',
              'bg-white hover:bg-slate-50'
            )}
            onClick={() => setViewFilter('products')}
          >
            Sản phẩm
          </Button>
          <Button
            className={cn(
              'rounded-3xl text-yellow-500 border-2 border-yellow-400',
              view === 'batches'
                ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                : 'bg-white hover:bg-slate-50'
            )}
            onClick={() => setViewFilter('batches')}
          >
            Lô hàng
          </Button>
        </div>
        <Link href={'inventories/adjustment'}>
          <Button>Điều chỉnh tồn kho</Button>
        </Link>
      </div>
    </CustomDataTable>
  ) : (
    <CustomDataTable2 columns={productsColumns} data={productsViewData}>
      <div className='w-full flex justify-between'>
        <div className='space-x-2'>
          <Button
            className={cn(
              'rounded-3xl text-blue-500 border-2 border-blue-500',
              view === 'products'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white hover:bg-slate-50'
            )}
            onClick={() => setViewFilter('products')}
          >
            Sản phẩm
          </Button>
          <Button
            className={cn(
              'rounded-3xl text-yellow-500 border-2 border-yellow-400',
              'bg-white hover:bg-slate-50'
            )}
            onClick={() => setViewFilter('batches')}
          >
            Lô hàng
          </Button>
        </div>
        <Link href={'inventories/adjustment'}>
          <Button>Điều chỉnh tồn kho</Button>
        </Link>
      </div>
    </CustomDataTable2>
  );
};

export default InventoryTable;
