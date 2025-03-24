'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import AddSaleDialog from '@/components/dialogs/AddSaleDialog';
import { Button } from '@/components/shadcn-base/Button';
import { DataTablePagination } from '@/components/shadcn-base/DataTablePagination';
import { Input } from '@/components/shadcn-base/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn-base/Table';
import { TranslatedMessage } from '@/components/app/TranslatedMessage';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, X } from 'lucide-react';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
    },
  });

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col rounded-md border'>
        <div className='flex p-5 border-b-[1px] w-full justify-between'>
          <div className='flex w-[50%]'>
            <Input className='w-1/3 mr-4' placeholder='Search sales...' />
            <Button className='w-[16%]'>
              <TranslatedMessage tKey='Management.filter' />
            </Button>
          </div>
          <div className='flex w-[50%] justify-end'>
            <AddSaleDialog />
          </div>
        </div>
        <div className='overflow-auto min-h-[58vh] max-h-[58vh]'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      <div className='flex cursor-default text-black w-full'>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        <div className='cursor-pointer ml-1'>
                          {header.column.getCanSort() ? (
                            header.column.getNextSortingOrder() === 'asc' ? (
                              <ArrowUpNarrowWide
                                className='text-black'
                                size={20}
                                onClick={() =>
                                  header.column.toggleSorting(false, true)
                                }
                              />
                            ) : header.column.getNextSortingOrder() ===
                              'desc' ? (
                              <ArrowDownWideNarrow
                                className='text-black'
                                size={20}
                                onClick={() =>
                                  header.column.toggleSorting(true, true)
                                }
                              />
                            ) : (
                              <X
                                className='text-black'
                                size={20}
                                onClick={() => header.column.toggleSorting()}
                              />
                            )
                          ) : null}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No sales found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className='p-2 border-t-[1px]'>
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}
