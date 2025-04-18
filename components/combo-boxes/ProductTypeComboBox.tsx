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
// import ProductTypeDialog from '../dialogs/ProductTypeDialog';
import { useProductTypes } from '@/hooks/queries/productTypeQueries';
import Error from '../app/Error';

interface ProductTypeComboBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const ProductTypeComboBox: React.FC<ProductTypeComboBoxProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const { data: productTypes, isPending, isError } = useProductTypes();

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
          {value
            ? productTypes?.find((p) => p.id === value)?.name
            : 'Chọn loại sản phẩm'}
          <ChevronsUpDown className='opacity-50 truncate' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        style={{ width: triggerRef.current?.offsetWidth }}
      >
        <Command>
          <CommandInput
            placeholder='Tìm loại sản phẩm...'
            className='h-9 pointer-events-auto'
          />
          <CommandList>
            <CommandEmpty>Không tìm thấy loại sản phẩm.</CommandEmpty>
            <CommandGroup>
              {!isPending ? (
                productTypes.map((p) => (
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
                <div className='flex justify-center items-center h-full w-full py-4'>
                  <div className='w-6 h-6 border-4 border-gray-300 border-t-primary rounded-full animate-spin'></div>
                </div>
              )}

              {/* <ProductTypeDialog> */}
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
              {/* </ProductTypeDialog> */}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductTypeComboBox;
