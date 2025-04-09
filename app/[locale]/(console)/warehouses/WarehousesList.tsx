'use client';
import { Input } from '@/components/shadcn-base/Input';
import React, { useState, useEffect } from 'react';
import WarehouseCard from './WarehouseCard';
import AddWarehouseDialog from '@/components/dialogs/AddWarehouseDialog';
import { usePathname } from '@/lib/i18n/routing';
import { useWarehouses } from '@/hooks/queries/warehouseQueries';
import { useAuth } from '@/components/providers/AuthProvider';
import { Warehouse } from '@/types/warehouse';

const WarehousesList = () => {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const { data: warehouses } = useWarehouses();

  const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const isAdmin = currentUser?.groups?.some((group) => group.id === '1');
    const userWarehouseIds = currentUser?.warehouses?.map((w) => w.id) || [];

    const baseWarehouses = isAdmin
      ? warehouses || []
      : warehouses?.filter((warehouse) =>
          userWarehouseIds.includes(warehouse.id)
        ) || [];

    const updatedWarehouses = baseWarehouses.filter((warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredWarehouses(updatedWarehouses);
  }, [currentUser, warehouses, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className='flex flex-col w-full border border-gray-200 rounded-lg bg-white shadow-sm'>
      {/* Search and Add Section */}
      <div className='flex items-center justify-between p-4 border-b border-gray-200'>
        <Input
          className='w-1/3 p-2 text-gray-700 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
          placeholder='Tìm kho theo tên...'
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <AddWarehouseDialog />
      </div>

      {/* Warehouses List */}
      <div className='flex flex-col gap-3 p-4 overflow-auto max-h-[70vh]'>
        {filteredWarehouses.length > 0 ? (
          filteredWarehouses.map((warehouse, index) => (
            <WarehouseCard
              key={index}
              idPath={`${pathname}/${warehouse.id}`}
              address={warehouse.address}
              area={`${warehouse.area.toString()}m²`}
              name={warehouse.name}
              operatedFrom={`${new Date(
                warehouse.operateFrom ?? ''
              ).toLocaleDateString('vi-VN')}`}
              phone={warehouse.phone || ''}
            />
          ))
        ) : (
          <div className='text-center text-gray-500 py-6'>
            Không tìm thấy kho nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehousesList;
