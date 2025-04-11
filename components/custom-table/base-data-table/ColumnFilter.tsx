import React from 'react';
import { Table } from '@tanstack/react-table';
import { Input } from '../../shadcn-base/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../shadcn-base/DropdownMenu';
import { Button } from '../../shadcn-base/Button';

interface DataTableFilterOptionsProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
}

export function DataTableFilterOptions<TData>({
  table,
}: DataTableFilterOptionsProps<TData>) {
  const activeFilters = table
    .getAllColumns()
    .filter((column) => column.getCanFilter() && column.getFilterValue())
    .map((column) => {
      const filterValue = column.getFilterValue();
      const meta = column.columnDef.meta as {
        title?: string;
        type?: string;
        options: string[];
      };
      const title = meta?.title || column.id;

      if (typeof filterValue === 'object' && filterValue !== null) {
        if ('from' in filterValue && 'to' in filterValue) {
          const from = filterValue.from ? filterValue.from : '...';
          const to = filterValue.to ? filterValue.to : '...';
          return `${title}: ${from} → ${to}`;
        }
        if ('from' in filterValue) {
          const from = filterValue.from ? filterValue.from : '...';
          return `${title}: ${from} → ...`;
        }
        if ('to' in filterValue) {
          const to = filterValue.to ? filterValue.to : '...';
          return `${title}: ... → ${to}`;
        }
      }

      return `${title}: ${filterValue}`;
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className='flex items-center justify-between w-full px-2 border rounded-md cursor-pointer bg-gray-100'
          tabIndex={0}
        >
          <span className='text-xs text-gray-700 truncate ml-2 space-x-2'>
            {activeFilters.length > 0
              ? activeFilters.map((filter, index) => (
                  <span key={index} className='p-1 text-xs font-medium'>
                    {filter},
                  </span>
                ))
              : 'Chưa lọc'}
          </span>
          <Button variant='ghost' size='sm' className='ml-2'>
            Bộ lọc
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='overflow-auto max-h-[50vh]'>
        <DropdownMenuLabel>Bộ lọc</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className='p-2'>
          {table
            .getAllColumns()
            .filter((column) => column.getCanFilter())
            .map((column) => {
              const meta = column.columnDef.meta as {
                title?: string;
                type?: string;
                options?: string[];
              };
              const isSelectColumn = meta?.type === 'select';
              const isDateColumn = meta?.type === 'date';
              const filterValue = column.getFilterValue();
              const isObject =
                typeof filterValue === 'object' &&
                filterValue !== null &&
                'from' in filterValue;

              const fromValue = isObject
                ? (filterValue as { from?: string }).from
                : '';
              const toValue = isObject
                ? (filterValue as { to?: string }).to
                : '';

              return (
                <div key={column.id} className='space-y-1 pb-2'>
                  <label className='text-sm font-medium'>
                    {(column.columnDef.meta as { title?: string }).title ||
                      column.id}
                  </label>

                  {isDateColumn ? (
                    <div className='flex space-x-2'>
                      <Input
                        type='date'
                        value={fromValue || ''}
                        onChange={(e) => {
                          const newFrom = e.target.value;
                          if (toValue && newFrom > toValue) return;
                          column.setFilterValue({
                            ...(isObject ? filterValue : {}),
                            from: newFrom,
                          });
                        }}
                      />
                      <Input
                        type='date'
                        value={toValue || ''}
                        onChange={(e) => {
                          const newTo = e.target.value;
                          if (fromValue && newTo < fromValue) return;
                          column.setFilterValue({
                            ...(isObject ? filterValue : {}),
                            to: newTo,
                          });
                        }}
                      />
                    </div>
                  ) : isSelectColumn ? (
                    <select
                      className='w-full p-2 text-sm border rounded-md'
                      value={(filterValue as string) ?? ''}
                      onChange={(e) => column.setFilterValue(e.target.value)}
                    >
                      <option value=''>Tất cả</option>
                      {meta?.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      value={(filterValue as string) ?? ''}
                      onChange={(e) => column.setFilterValue(e.target.value)}
                      placeholder={`Nhập ${
                        (
                          column.columnDef.meta as { title?: string }
                        ).title?.toLowerCase() ?? column.id
                      }...`}
                    />
                  )}
                </div>
              );
            })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DataTableFilterOptionsProps;
