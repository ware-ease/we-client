import { cn } from '@/lib/utils/utils';
import { Account } from '@/types/account';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import { Button } from '../shadcn-base/Button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../shadcn-base/Command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../shadcn-base/Popover';

interface AccountComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  accounts: Account[];
}

const AccountComboBox: React.FC<AccountComboBoxProps> = ({
  value,
  onChange,
  accounts,
}) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Extract warehouseId from URL path
  const { warehouseId } = useParams<{ warehouseId: string }>(); // Extracts the warehouseId from the URL path

  // Filter accounts that are associated with the current warehouseId and have groupId = 3
  const filteredAccounts = warehouseId
    ? accounts.filter(
        (acc) =>
          acc.warehouses?.some((warehouse) => warehouse.id === warehouseId) && // Check if warehouseId matches any warehouse in the account
          acc.groups.some((group) => group.id === '3') // Check if the account belongs to groupId 3
      )
    : accounts.filter((acc) => acc.groups.some((group) => group.id === '3')); // If no warehouseId in URL, filter by groupId 3

  const selectedAccount = filteredAccounts.find((acc) => acc.id === value);

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
          {selectedAccount
            ? `${selectedAccount.profile?.lastName ?? ''} ${
                selectedAccount.profile?.firstName ?? ''
              }`.trim() || 'Chọn nhân viên'
            : 'Chọn nhân viên'}

          <ChevronsUpDown className='opacity-50 h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        style={{ width: triggerRef.current?.offsetWidth }}
      >
        <Command>
          <CommandInput placeholder='Tìm nhân viên...' className='h-9' />
          <CommandList>
            <CommandEmpty>Không tìm thấy nhân viên.</CommandEmpty>
            <CommandGroup>
              {filteredAccounts.map((acc) => (
                <CommandItem
                  key={acc.id}
                  value={acc.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {`${acc.profile.lastName} ${acc.profile.firstName}`}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === acc.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AccountComboBox;
