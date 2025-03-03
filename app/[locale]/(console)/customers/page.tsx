import { TranslatedMessage } from '@/app/_components/TranslatedMessage';
import { Customer, columns } from './Columns';
import { DataTable } from './DataTable';

async function getData(): Promise<Customer[]> {
  // Dữ liệu mẫu, sau này có thể thay bằng API call.
  return [
    {
      id: '1',
      name: 'John Doe',
      phone: '123-456-7890',
      status: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '098-765-4321',
      status: false,
    },
    {
      id: '3',
      name: 'Alice Brown',
      phone: '555-123-4567',
      status: true,
    },
    {
      id: '4',
      name: 'Bob Johnson',
      phone: '444-987-6543',
      status: false,
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
