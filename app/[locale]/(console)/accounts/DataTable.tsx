'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/app/_components/shadcn-base/Button';
import { DataTablePagination } from '@/app/_components/shadcn-base/DataTablePagination';
import { Input } from '@/app/_components/shadcn-base/Input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/shadcn-base/Table';
import { TranslatedMessage } from '@/app/_components/TranslatedMessage';
import { rankItem } from '@tanstack/match-sorter-utils';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, X } from 'lucide-react';
import { useState } from 'react';
import AddAccountDialog from '../../../_components/dialogs/AddAccountDialog';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: unknown }[]
  >([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    // Lọc dữ liệu toàn bộ bảng (Global Filter)
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      return rankItem(String(row.getValue(columnId)), filterValue).passed;
    },

    // Lọc dữ liệu theo từng cột (Column Filters)
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },

    // Lọc theo sub-rows nếu có
    filterFromLeafRows: true,
    maxLeafRowFilterDepth: 0, // Chỉ lọc dữ liệu cha, không lọc con
  });

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col rounded-md border'>
        {/* Thanh Tìm Kiếm */}
        <div className='flex p-5 border-b-[1px] w-full justify-between'>
          <div className='flex w-[50%]'>
            <Input
              className='w-1/3 mr-4'
              placeholder='Search accounts...'
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <Button className='w-[16%]' onClick={() => setGlobalFilter('')}>
              <TranslatedMessage tKey='Management.filter' />
            </Button>
          </div>
          <div className='flex w-[50%] justify-end'>
            <AddAccountDialog />
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className='overflow-auto min-h-[58vh] max-h-[58vh]'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
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
                            ) : undefined}
                          </div>
                        </div>

                        {/* Ô nhập filter cho từng cột */}
                        {header.column.getCanFilter() &&
                        header.column.columnDef.enableColumnFilter !== false ? (
                          <Input
                            className='mt-2 w-full'
                            placeholder={`Filter ${header.column.id}`}
                            value={
                              (table
                                .getState()
                                .columnFilters.find(
                                  (f) => f.id === header.column.id
                                )?.value as string) || ''
                            }
                            onChange={(e) =>
                              table
                                .getColumn(header.column.id)
                                ?.setFilterValue(e.target.value)
                            }
                          />
                        ) : null}
                      </TableHead>
                    );
                  })}
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Phân trang */}
        <div className='p-2 border-t-[1px]'>
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}
