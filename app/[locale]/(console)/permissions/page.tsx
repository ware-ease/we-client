'use client';

import { Button } from '@/app/_components/shadcn-base/Button';
import { List, Users } from 'lucide-react';
import { useState } from 'react';
import Accounts from './Accounts';
import { columns } from './Columns';
import { DataTable } from './DataTable';
import Groups from './Groups';

const data = [
  {
    page: 'Dashboard',
    add: true,
    update: false,
    delete: true,
  },
  {
    page: 'Users',
    add: false,
    update: true,
    delete: false,
  },
  {
    page: 'Settings',
    add: true,
    update: true,
    delete: false,
  },
];

const Permissions = () => {
  const [activeTab, setActiveTab] = useState<'Groups' | 'Accounts'>('Groups');
  const [selectedItem, setSelectedItem] = useState('');

  return (
    <div className='flex p-6 bg-gray-100'>
      <div className='w-1/4 bg-white shadow-lg rounded-lg p-4'>
        <div className='flex gap-2 mb-4'>
          <Button
            variant={activeTab === 'Groups' ? 'default' : 'outline'}
            onClick={() => setActiveTab('Groups')}
          >
            <List className='h-5 w-5 mr-1' /> Groups
          </Button>
          <Button
            variant={activeTab === 'Accounts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('Accounts')}
          >
            <Users className='h-5 w-5 mr-1' /> Accounts
          </Button>
        </div>
        {activeTab === 'Groups' ? (
          <Groups onSelect={(item) => setSelectedItem(item)} />
        ) : (
          <Accounts onSelect={(item) => setSelectedItem(item)} />
        )}
      </div>

      <div className='w-3/4 ml-6 bg-white shadow-lg rounded-lg p-4'>
        <h2 className='text-lg font-semibold mb-4 flex items-center gap-2'>
          Permissions for{' '}
          <span className='text-blue-500'>
            {selectedItem || 'None Selected'}
          </span>
        </h2>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Permissions;
