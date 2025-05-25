import { Inventory } from '@/types/warehouse';
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
import Loading from '../app/Loading';
import { cn } from '@/lib/utils/utils';
import { removeVietnameseDiacritics } from '@/lib/utils/vietnameseConverter';

interface InventoryComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  inventories?: Inventory[];
  fullInfo?: boolean;
}

const InventoryComboBox: React.FC<InventoryComboBoxProps> = ({
  value,
  onChange,
  disabled = false,
  inventories: initialInventories,
  fullInfo = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const inventories = initialInventories || [];

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
          {value
            ? inventories.find((p) => p.id === value)?.batch.product?.sku
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
            const valueName =
              inventories.find((p) => p.id === value)?.batch.product?.name ||
              '';
            const valueSku =
              inventories.find((p) => p.id === value)?.batch.product?.sku || '';
            const valueCode =
              inventories.find((p) => p.id === value)?.batch.code || '';
            console.log(valueSku);
            const normalizedValueName = removeVietnameseDiacritics(valueName);
            const normalizedValueSku = removeVietnameseDiacritics(valueSku);
            const normalizedValueCode = removeVietnameseDiacritics(valueCode);
            const normalizedSearch = removeVietnameseDiacritics(search);
            return normalizedValueName.includes(normalizedSearch) ||
              normalizedValueSku.includes(normalizedSearch) ||
              normalizedValueCode.includes(normalizedSearch)
              ? 1
              : 0;
          }}
        >
          <CommandInput placeholder='Nhập Tên/SKU...' className='h-9' />
          <CommandList>
            <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
            <CommandGroup className='overflow-x-auto'>
              {inventories ? (
                inventories.map((p) => (
                  <CommandItem
                    key={p.id}
                    value={p.id}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                    className={`${
                      p.batch.expDate <= new Date().toISOString() &&
                      p.batch.expDate > new Date('01-01-0001').toISOString()
                        ? 'text-red-500 font-medium'
                        : ''
                    }`}
                  >
                    {fullInfo
                      ? `${p.batch.product?.name}, lô ${p.batch.code}, tồn kho: ${p.currentQuantity}`
                      : p.batch.product?.name}
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

export default InventoryComboBox;
