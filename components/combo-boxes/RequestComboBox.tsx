'use client';
import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/shadcn-base/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/shadcn-base/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn-base/Popover';
import { cn } from '@/lib/utils/utils';
import { GoodRequest } from '@/types/goodRequest';
import { usePathname } from '@/lib/i18n/routing';

interface RequestComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  requests: GoodRequest[] | undefined;
}

const RequestComboBox: React.FC<RequestComboBoxProps> = ({
  value,
  onChange,
  requests,
}) => {
  const pathname = usePathname();
  const warehouseId = pathname.split('/')[2];
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between'
        >
          {value
            ? requests
                ?.filter((r) => r.requestedWarehouseId === warehouseId)
                .find((req) => req.id === value)?.code
            : 'Chọn yêu cầu'}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Tìm yêu cầu...' className='h-9' />
          <CommandList>
            <CommandEmpty>Hiện chưa có yêu cầu.</CommandEmpty>
            <CommandGroup>
              {requests ? (
                requests
                  .filter(
                    (r) =>
                      r.requestedWarehouseId === warehouseId ||
                      (r.requestType === 2 && r.warehouseId === warehouseId)
                  )
                  .map((req) => (
                    <CommandItem
                      key={req.id}
                      value={req.id}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      {req.code}
                      <Check
                        className={cn(
                          'ml-auto',
                          value === req.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))
              ) : (
                <div className='flex justify-center items-center h-full w-full py-4'>
                  <div className='w-6 h-6 border-4 border-gray-300 border-t-primary rounded-full animate-spin'></div>
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default RequestComboBox;
