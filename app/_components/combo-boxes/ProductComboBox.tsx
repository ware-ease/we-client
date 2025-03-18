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
import { Product } from '@/lib/types/product';

interface ProductComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  products: Product[] | undefined;
}

const ProductComboBox: React.FC<ProductComboBoxProps> = ({
  value,
  onChange,
  products,
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
          {value ? products?.find((p) => p.id === value)?.sku : 'Chọn sản phẩm'}
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
              {products ? (
                products.map((p, index) => (
                  <CommandItem
                    key={index}
                    value={p.id}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    {p.sku}
                    <Check
                      className={cn(
                        'ml-auto',
                        value === p.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))
              ) : (
                <div className='flex justify-center items-center h-full w-full py-4'>
                  <div className='w-6 h-6 border-4 border-gray-300 border-t-primary rounded-full animate-spin'></div>
                </div>
              )}
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
