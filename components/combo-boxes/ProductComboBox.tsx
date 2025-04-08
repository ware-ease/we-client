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
import { useProducts } from '@/hooks/queries/productQueries';
import Loading from '../app/Loading';
import Error from '../app/Error';
import ProductDialog from '../dialogs/ProductDialog';

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
  const { data: products, isPending, isError } = useProducts();

  if (isError) {
    return <Error />;
  }

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
          {isPending
            ? 'Chọn sản phẩm'
            : value
            ? products.find((p) => p.id === value)?.sku
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
              {!isPending ? (
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
                <Loading />
              )}
              <ProductDialog>
                <button className='w-full'>
                  <CommandItem
                    className='text-white bg-blue-500 hover:!bg-blue-700 hover:!text-white'
                    onSelect={() => handleOnAdd()}
                    aria-selected={false}
                  >
                    Thêm
                    <Settings className='ml-auto text-white' />
                  </CommandItem>
                </button>
              </ProductDialog>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductComboBox;
