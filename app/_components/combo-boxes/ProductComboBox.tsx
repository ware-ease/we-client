'use client';
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../shadcn-base/Popover';
import { Button } from '../shadcn-base/Button';
import { Check, ChevronsUpDown, Settings } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../shadcn-base/Command';
import { cn } from '@/lib/utils/utils';

const products = [
  {
    value: 'Xi măng S1',
    label: 'Xi măng S1',
  },
  {
    value: 'Sơn Nippon',
    label: 'Sơn Nippon',
  },
  {
    value: 'Cát Bà',
    label: 'Cát Bà',
  },
];

const ProductComboBox = () => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const handleOnSelect = () => {};

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between border-none'
          ref={triggerRef}
        >
          {value
            ? products.find((p) => p.value === value)?.label
            : 'Chọn sản phẩm'}
          <ChevronsUpDown className='opacity-50 truncate' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        style={{ width: triggerRef.current?.offsetWidth }}
      >
        <Command>
          <CommandInput placeholder='Tìm sản phẩm...' className='h-9' />
          <CommandList>
            <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
            <CommandGroup>
              {products.map((p) => (
                <CommandItem
                  key={p.value}
                  value={p.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {p.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === p.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
              <CommandItem
                className='text-white bg-blue-500 hover:!bg-blue-700 hover:!text-white'
                onSelect={() => handleOnSelect()}
              >
                Thêm
                <Settings className='ml-auto text-white' />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductComboBox;
