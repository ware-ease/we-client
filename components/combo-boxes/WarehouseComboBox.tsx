'use client';
import React, { useEffect } from 'react';
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
import { useWarehouses as useAssignedWarehouses } from '@/hooks/queries/accountQueries';
import { useParams } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';
import { Warehouse } from '@/types/warehouse';

interface WarehouseComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  onlyAssignedWarehouses?: boolean;
}

const WarehouseComboBox: React.FC<WarehouseComboBoxProps> = ({
  value,
  onChange,
  onlyAssignedWarehouses = false,
}) => {
  const { currentUser } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [filteredWarehouses, setFilteredWarehouses] = React.useState<
    Warehouse[]
  >([]);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const { data: warehouses, isPending, isError } = useWarehouses();
  const {
    data: assignedWarehouses,
    isPending: isAssignedPending,
    isError: isAssignedError,
  } = useAssignedWarehouses();

  useEffect(() => {
    const isAdmin = currentUser?.groups?.some((group) => group.id === '1');
    const userWarehouseIds = currentUser?.warehouses?.map((w) => w.id) || [];

    const baseWarehouses = isAdmin
      ? warehouses || []
      : warehouses?.filter((warehouse) =>
          userWarehouseIds.includes(warehouse.id)
        ) || [];

    setFilteredWarehouses(baseWarehouses);
  }, [currentUser, warehouses]);

  const { warehouseId } = useParams();

  if (isError || isAssignedError) {
    return <Error />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={`w-full justify-between ${
            assignedWarehouses ? 'border-none' : ''
          }`}
          ref={triggerRef}
        >
          {isPending || isAssignedPending
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
              {!isPending && !isAssignedPending ? (
                onlyAssignedWarehouses ? (
                  filteredWarehouses
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
                )
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
