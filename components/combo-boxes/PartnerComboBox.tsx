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
import Error from '../app/Error';
import { usePartners } from '@/hooks/queries/partnerQueries';
import SupplierDialog from '../dialogs/SupplierDialog';
import CustomerDialog from '../dialogs/CustomerDialog';

interface PartnerComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  partnerType: number;
}

const PartnerComboBox: React.FC<PartnerComboBoxProps> = ({
  value,
  onChange,
  partnerType,
}) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const { data: partners, isPending, isError } = usePartners(partnerType);

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
          className='w-full justify-between border-none'
          ref={triggerRef}
        >
          {value
            ? partners?.find((p) => p.id === value)?.name
            : partnerType === 0
            ? 'Chọn nhà cung cấp'
            : 'Chọn khách hàng'}
          <ChevronsUpDown className='opacity-50 truncate' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        style={{ width: triggerRef.current?.offsetWidth }}
      >
        <Command>
          <CommandInput placeholder='Tìm đối tác...' className='h-9' />
          <CommandList>
            <CommandEmpty>Không tìm thấy đối tác.</CommandEmpty>
            <CommandGroup>
              {!isPending ? (
                partners
                  .filter((p) => p.status === true)
                  .map((p) => (
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
              {partnerType === 0 ? (
                <SupplierDialog>
                  <button className='w-full'>
                    <CommandItem
                      className='text-white bg-blue-500 hover:!bg-blue-700 hover:!text-white'
                      aria-selected={false}
                    >
                      Thêm
                      <Settings className='ml-auto text-white' />
                    </CommandItem>
                  </button>
                </SupplierDialog>
              ) : (
                <CustomerDialog>
                  <button className='w-full'>
                    <CommandItem
                      className='text-white bg-blue-500 hover:!bg-blue-700 hover:!text-white'
                      aria-selected={false}
                    >
                      Thêm
                      <Settings className='ml-auto text-white' />
                    </CommandItem>
                  </button>
                </CustomerDialog>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PartnerComboBox;
