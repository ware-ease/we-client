'use client';

import { TranslatedMessage } from '@/components/app/TranslatedMessage';
import { Sale } from '@/types/sale';
import { columns } from './Columns';
import { DataTable } from './DataTable';

const Sales = () => {
  const data: Sale[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      customer: 'John Doe',
      totalAmount: 120.5,
      status: 'Completed',
      date: '2025-02-20',
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customer: 'Jane Smith',
      totalAmount: 85.75,
      status: 'Pending',
      date: '2025-02-19',
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      customer: 'Michael Brown',
      totalAmount: 200.0,
      status: 'Shipped',
      date: '2025-02-18',
    },
  ];

  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-6'>
          <div className='text-4xl font-semibold text-primary'>
            <TranslatedMessage tKey='Sales.title' />
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Sales;
