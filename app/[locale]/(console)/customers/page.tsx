import { TranslatedMessage } from '@/app/_components/TranslatedMessage';
import { Customer } from '@/lib/types/customer';
import { columns } from './Columns';
import { DataTable } from './DataTable';

async function getData(): Promise<Customer[]> {
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '123-456-7890',
      address: '123 Main St, New York, NY',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      phone: '098-765-4321',
      address: '456 Oak St, Los Angeles, CA',
      status: 'inactive',
    },
    {
      id: '3',
      name: 'Alice Brown',
      email: 'alicebrown@example.com',
      phone: '555-123-4567',
      address: '789 Maple St, Chicago, IL',
      status: 'active',
    },
    {
      id: '4',
      name: 'Bob Johnson',
      email: 'bobjohnson@example.com',
      phone: '444-987-6543',
      address: '101 Pine St, Houston, TX',
      status: 'banned',
    },
  ];
}

export default async function Customers() {
  const data = await getData();

  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-6'>
          <div className='text-4xl font-semibold text-primary'>
            <TranslatedMessage tKey='Customers.title' />
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
