'use client';
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../shadcn-base/Popover';
import { Button } from '../shadcn-base/Button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../shadcn-base/Command';
import { cn } from '@/lib/utils/utils';
import Loading from '../app/Loading';
import Error from '../app/Error';
import { useWarehouses } from '@/hooks/queries/warehouseQueries';
import { useParams } from 'next/navigation';

interface WarehouseComboBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const WarehouseComboBox: React.FC<WarehouseComboBoxProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const { data: warehouses, isPending, isError } = useWarehouses();
  const { warehouseId } = useParams();

  if (isError) {
    return <Error />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
          ref={triggerRef}
        >
          {isPending
            ? 'Chọn kho'
            : value
            ? warehouses.find((p) => p.id === value)?.name
            : 'Chọn kho'}
          <ChevronsUpDown className='opacity-50 truncate' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        style={{ width: triggerRef.current?.offsetWidth }}
      >
        <Command>
          <CommandInput placeholder='Tìm kho...' className='h-9' />
          <CommandList>
            <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
            <CommandGroup>
              {!isPending ? (
                warehouses
                  .filter((w) => w.id !== warehouseId)
                  .map((p, index) => (
                    <CommandItem
                      key={index}
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default WarehouseComboBox;
