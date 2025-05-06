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
import { removeVietnameseDiacritics } from '@/lib/utils/vietnameseConverter';
import { Product } from '@/types/product';

interface ProductComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  products?: Product[];
}

const ProductComboBox: React.FC<ProductComboBoxProps> = ({
  value,
  onChange,
  disabled = false,
  products: initialProducts,
}) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const { data: fetchedProducts, isPending, isError } = useProducts();

  // Use initialProducts if provided, otherwise use fetchedProducts
  const products = initialProducts || fetchedProducts || [];
  const effectiveIsPending = initialProducts ? false : isPending;
  const effectiveIsError = initialProducts ? false : isError;

  if (effectiveIsError) {
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
          className='w-full justify-between border-none transform-none'
          ref={triggerRef}
          disabled={disabled}
        >
          {effectiveIsPending
            ? 'Chọn sản phẩm'
            : value
            ? products.find((p) => p.id === value)?.sku
            : 'Chọn sản phẩm'}
          <ChevronsUpDown className='opacity-50 truncate' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0 transform-none'
        style={{ width: triggerRef.current?.offsetWidth }}
      >
        <Command
          filter={(value, search) => {
            const realValue = products.find((p) => p.id === value)?.name || '';
            const normalizedRealValue = removeVietnameseDiacritics(realValue);
            const normalizedSearch = removeVietnameseDiacritics(search);
            return normalizedRealValue.includes(normalizedSearch) ? 1 : 0;
          }}
        >
          <CommandInput placeholder='Tìm sản phẩm...' className='h-9' />
          <CommandList>
            <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
            <CommandGroup>
              {!effectiveIsPending ? (
                products.map((p) => (
                  <CommandItem
                    key={p.id}
                    value={p.id}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    {p.name}
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
            </CommandGroup>
            <div className='border-t border-gray-200'>
              <ProductDialog>
                <button className='w-full'>
                  <div
                    className='flex items-center px-2 py-1.5 text-white bg-blue-500 hover:bg-blue-700 text-sm'
                    onClick={() => handleOnAdd()}
                  >
                    Thêm
                    <Settings className='ml-auto h-4 w-4' />
                  </div>
                </button>
              </ProductDialog>
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductComboBox;
