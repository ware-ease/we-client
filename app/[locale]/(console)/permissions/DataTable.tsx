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
import { useMemo, useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends { page: string }, TValue>({
  columns,
  data = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterText, setFilterText] = useState('');

  // Lọc dữ liệu dựa trên filterText
  const filteredData = useMemo(() => {
    if (!filterText) return data;
    return data.filter((item) =>
      item.page.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [data, filterText]);

  const table = useReactTable({
    data: filteredData, // Sử dụng dữ liệu đã lọc
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
            <Input
              className='w-2/4 mr-4'
              placeholder='Search permissions...'
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
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
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
        <div className='p-2 border-t-[1px]'>
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}
