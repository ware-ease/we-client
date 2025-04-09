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
  CommandItem,
  CommandList,
} from '../shadcn-base/Command';
import { cn } from '@/lib/utils/utils';

const requestTypes = [
  { id: '0', type: 'Nhập hàng' },
  { id: '1', type: 'Xuất hàng' },
  // { id: '2', type: 'Chuyển hàng' },
  // { id: '3', type: 'Trả hàng' },
];

interface RequestTypeComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const RequestTypeComboBox: React.FC<RequestTypeComboBoxProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
          ref={triggerRef}
          disabled={disabled}
        >
          {value ? requestTypes.find((p) => p.id === value)?.type : 'Chọn loại'}
          <ChevronsUpDown className='opacity-50 truncate' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        style={{ width: triggerRef.current?.offsetWidth }}
      >
        <Command>
          {/* <CommandInput placeholder='Tìm loại...' className='h-9' /> */}
          <CommandList>
            <CommandEmpty>Không tìm thấy sản phẩm.</CommandEmpty>
            <CommandGroup>
              {requestTypes.map((p, index) => (
                <CommandItem
                  key={index}
                  value={p.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {p.type}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === p.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
              {/* <CommandItem
                className='text-white bg-blue-500 hover:!bg-blue-700 hover:!text-white'
                onSelect={() => handleOnAdd()}
                aria-selected={false}
              >
                Thêm
                <Settings className='ml-auto text-white' />
              </CommandItem> */}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default RequestTypeComboBox;
