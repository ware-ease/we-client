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
  { sku: 'XMS01', name: 'Xi măng S1', unit: 'tấn' },
  { sku: 'SNNPN', name: 'Sơn Nippon', unit: 'thùng 18L' },
  { sku: 'CTBA', name: 'Cát Bà', unit: 'bao 10kg' },
];

interface ProductComboBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const ProductComboBox: React.FC<ProductComboBoxProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const handleOnAdd = () => {};

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
          {value ? products.find((p) => p.sku === value)?.sku : 'Chọn sản phẩm'}
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
                  key={p.sku}
                  value={p.sku}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {p.sku}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === p.sku ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
              <CommandItem
                className='text-white bg-blue-500 hover:!bg-blue-700 hover:!text-white'
                onSelect={() => handleOnAdd()}
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
