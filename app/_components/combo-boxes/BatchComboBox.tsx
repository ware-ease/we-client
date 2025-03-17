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

const batches = [{ code: 'XM477' }, { code: 'SN346' }, { code: 'CTB11' }];

interface BatchComboBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const BatchComboBox: React.FC<BatchComboBoxProps> = ({ value, onChange }) => {
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
          {value ? batches.find((p) => p.code === value)?.code : 'Chọn lô'}
          <ChevronsUpDown className='opacity-50 truncate' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        style={{ width: triggerRef.current?.offsetWidth }}
      >
        <Command>
          <CommandInput placeholder='Tìm lô...' className='h-9' />
          <CommandList>
            <CommandEmpty>Không tìm thấy lô.</CommandEmpty>
            <CommandGroup>
              {batches.map((p) => (
                <CommandItem
                  key={p.code}
                  value={p.code}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {p.code}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === p.code ? 'opacity-100' : 'opacity-0'
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

export default BatchComboBox;
