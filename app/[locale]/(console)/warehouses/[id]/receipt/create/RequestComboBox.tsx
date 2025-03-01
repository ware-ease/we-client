'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/app/_components/shadcn-base/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/_components/shadcn-base/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/_components/shadcn-base/Popover';
import { cn } from '@/lib/utils/utils';

const frameworks = [
  {
    value: 'next.js',
    label: 'Nhập mua NM001',
  },
  {
    value: 'sveltekit',
    label: 'Nhập trả hàng NTH001',
  },
  {
    value: 'nuxt.js',
    label: 'Nhập chuyển kho NCK001',
  },
];

export function RequestComboBox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : 'Chọn yêu cầu'}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Tìm yêu cầu...' className='h-9' />
          <CommandList>
            <CommandEmpty>Hiện chưa có yêu cầu.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === framework.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
