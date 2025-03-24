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
import UnitDialog from '../dialogs/UnitDialog';
import Loading from '../app/Loading';
import { useUnits } from '@/hooks/queries/unitQueries';
import Error from '../app/Error';

interface UnitComboBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const UnitComboBox: React.FC<UnitComboBoxProps> = ({ value, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const { data: units, isPending, isError } = useUnits();

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
          {value ? units?.find((p) => p.id === value)?.name : 'Chọn đơn vị'}
          <ChevronsUpDown className='opacity-50 truncate' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        style={{ width: triggerRef.current?.offsetWidth }}
      >
        <Command>
          <CommandInput
            placeholder='Tìm đơn vị...'
            className='h-9 pointer-events-auto'
          />
          <CommandList>
            <CommandEmpty>Không tìm thấy đơn vị.</CommandEmpty>
            <CommandGroup>
              {!isPending ? (
                units.map((p) => (
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

              <UnitDialog>
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
              </UnitDialog>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default UnitComboBox;
