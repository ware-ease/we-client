import React from 'react';
import { DataTable } from './DataTable';
import { columns } from './Columns';
import { Issue } from '@/types/issue';

const data: Issue[] = [
  {
    id: 'abcxyz',
    code: 'PN0001',
    date: new Date('2024-11-11'),
    supplier: 'Hoyoverse',
    shipper: 'Nguyen Van A',
    receiver: 'Nguyen Van B',
  },
  {
    id: 'abcxyz',
    code: 'PN0002',
    date: new Date('2024-10-11'),
    supplier: 'Mihoyo',
    shipper: 'Nguyen Van A',
    receiver: 'Nguyen Van B',
  },
  {
    id: 'abcxyz',
    code: 'PN0003',
    date: new Date('2024-09-11'),
    supplier: 'Cosmosphere',
    shipper: 'Nguyen Van A',
    receiver: 'Nguyen Van B',
  },
];

const WarehouseIssue = () => {
  return (
    <div className='flex flex-col max-h-full'>
      <div className='flex flex-col p-4 gap-6 max-h-full'>
        <div className='mb-6'>
          <div className='text-4xl font-semibold text-primary'>
            {/* <TranslatedMessage tKey='Accounts.title' /> */}
            Xuất kho
          </div>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default WarehouseIssue;
