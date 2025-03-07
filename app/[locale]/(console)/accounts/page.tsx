'use client';

import { TranslatedMessage } from '@/app/_components/TranslatedMessage';
import { getAllAccounts } from '@/lib/services/accountService';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { columns } from './Columns';
import { DataTable } from './DataTable';

export default function Accounts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAllAccounts,
  });
  console.log(data);

  if (isLoading) {
    return <p className='text-center text-gray-500'>Loading...</p>;
  }

  if (isError) {
    toast.error('Failed to fetch accounts.');
    return <p className='text-center text-red-500'>Error loading accounts.</p>;
  }

  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-6'>
          <div className='text-4xl font-semibold text-primary'>
            <TranslatedMessage tKey='Accounts.title' />
          </div>
        </div>
        <DataTable columns={columns} data={data!} />
      </div>
    </div>
  );
}
