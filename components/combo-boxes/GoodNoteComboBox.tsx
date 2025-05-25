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
import { removeVietnameseDiacritics } from '@/lib/utils/vietnameseConverter';
import { useGoodIssueNotes } from '@/hooks/queries/goodNoteQueries';

interface GoodNoteComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  requestId: string;
}

const GoodNoteComboBox: React.FC<GoodNoteComboBoxProps> = ({
  value,
  onChange,
  requestId,
}) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const { data: goodNotes, isPending, isError } = useGoodIssueNotes(true);

  const effectiveIsPending = isPending;
  const effectiveIsError = isError;

  if (effectiveIsError) {
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
          {effectiveIsPending
            ? 'Chọn phiếu'
            : value
            ? goodNotes.find((p) => p.id === value)?.code
            : 'Chọn phiếu'}
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
              goodNotes?.find(
                (p) => p.id === value && p.goodRequest?.id === requestId
              )?.code || '';
            const normalizedValueName = removeVietnameseDiacritics(valueName);
            const normalizedSearch = removeVietnameseDiacritics(search);
            return normalizedValueName.includes(normalizedSearch) ? 1 : 0;
          }}
        >
          <CommandInput placeholder='Nhập mã...' className='h-9' />
          <CommandList>
            <CommandEmpty>Không tìm thấy phiếu.</CommandEmpty>
            <CommandGroup className='overflow-x-auto'>
              {!effectiveIsPending ? (
                goodNotes
                  .filter((p) => p.goodRequest?.id === requestId)
                  .map((p) => (
                    <CommandItem
                      key={p.id}
                      value={p.id}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      {p.code}
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

export default GoodNoteComboBox;
