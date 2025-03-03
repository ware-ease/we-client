'use client';

import DetailSaleDialog from '@/app/_components/dialogs/DetailSaleDialog';
import { Sale, SaleDetail } from '@/lib/types/sale';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    sortingFn: 'text',
  },
  {
    accessorKey: 'orderNumber',
    header: 'Order Number',
    sortingFn: 'text',
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    sortingFn: 'text',
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    sortingFn: 'basic',
    cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    sortingFn: 'text',
  },
  {
    accessorKey: 'date',
    header: 'Date',
    sortingFn: 'datetime',
  },
  {
    accessorKey: 'actions',
    header: () => <div className='text-right w-full'>Actions</div>,
    enableSorting: false,
    cell: ({ row }) => {
      const saleDetail: SaleDetail = { ...row.original, items: [] };

      return (
        <div className='flex justify-end'>
          <DetailSaleDialog sale={saleDetail} />
        </div>
      );
    },
  },
];
