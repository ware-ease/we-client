'use client';
import AddWarehouseDialog from '@/components/dialogs/AddWarehouseDialog';
import { useAuth } from '@/components/providers/AuthProvider';
import { Input } from '@/components/shadcn-base/Input';
import { useWarehouses } from '@/hooks/queries/warehouseQueries';
import { usePathname } from '@/lib/i18n/routing';
import { Warehouse } from '@/types/warehouse';
import React, { useEffect, useState } from 'react';
import WarehouseCard from './WarehouseCard';

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
      <div className='flex justify-between items-center p-4 bg-gray-50 border-b'>
        <Input
          className='w-1/3'
          placeholder='Tìm kho theo tên...'
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <AddWarehouseDialog />
      </div>

      {/* Warehouses List with Background Image */}
      <div
        className='flex flex-col gap-3 p-4 overflow-auto max-h-[75vh] min-h-[65vh] bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage:
            'url(https://img.freepik.com/free-vector/logistic-workers-carrying-boxes-with-loaders_74855-6541.jpg?t=st=1746985983~exp=1746989583~hmac=9c04605cf4c0989d70085267f93d92efe1189bd7ae5f8eb7eff9b8bb9ec5655d&w=1380)',
        }}
      >
        {filteredWarehouses.length > 0 ? (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredWarehouses.map((warehouse, index) => (
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
              ))}
            </div>
          </>
        ) : (
          <div className='text-center text-gray-500 py-6'>
            Không tìm thấy kho nào.
          </div>
        )}
      </div>
      {/* Info text */}
      <div className='text-center text-muted-foreground mt-6 text-sm'>
        Tổng số kho: {filteredWarehouses.length} – Hãy mở rộng hệ thống kho để
        quản lý hiệu quả hơn.
      </div>
    </div>
  );
};

export default WarehousesList;
