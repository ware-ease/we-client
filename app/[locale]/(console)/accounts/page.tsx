import { Account, columns } from './Columns';
import { DataTable } from './DataTable';
import { TranslatedMessage } from '@/app/_components/TranslatedMessage';

async function getData(): Promise<Account[]> {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      amount: 3,
      status: 'success',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 7,
      status: 'success',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 8,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 125,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'success',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'failed',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 90,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'failed',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'failed',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 20,
      status: 'failed',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 5,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 100,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 70,
      status: 'pending',
      email: 'm@example.com',
    },
    {
      id: '728ed52f',
      amount: 20,
      status: 'pending',
      email: 'm@example.com',
    },
    // ...
  ];
}

export default async function Accounts() {
  const data = await getData();

  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-6'>
          <div className='text-4xl font-semibold text-primary'>
            <TranslatedMessage tKey='Accounts.title' />
          </div>
          <div></div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
