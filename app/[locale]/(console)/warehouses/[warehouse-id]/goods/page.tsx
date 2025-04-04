'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn-base/Table';
import { Inventory } from '@/types/warehouse';
import { useWarehousesInventories } from '@/hooks/queries/warehouseQueries';
import { usePathname } from '@/lib/i18n/routing';

const WarehouseGoods = () => {
  const pathname = usePathname();

  const pathSegments = pathname.split('/');
  const warehouseId = pathSegments[2] ?? '';
  const { data: warehouseWithInventories, isPending } =
    useWarehousesInventories(true, warehouseId);
  const [inventories, setInventories] = useState<Inventory[]>([]);

  // Assuming currentWarehouse has an inventory field; adjust based on your API
  useEffect(() => {
    setInventories(warehouseWithInventories?.inventories || []);
  }, [warehouseWithInventories?.inventories]);

  if (isPending) {
    return <div className='p-6'>Loading...</div>;
  }

  return (
    <div className='p-4'>
      <h1 className='text-4xl font-bold mb-4 text-gray-800'>
        Tồn kho của {warehouseWithInventories?.name}
      </h1>

      {/* Inventory Table */}
      {inventories.length === 0 ? (
        <p className='text-gray-500'>{'Kho này chưa có hàng tồn kho.'}</p>
      ) : (
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='font-semibold text-gray-700'>
                  Mã lô
                </TableHead>
                <TableHead className='font-semibold text-gray-700'>
                  Sản phẩm
                </TableHead>
                <TableHead className='font-semibold text-gray-700'>
                  Số lượng
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventories.map((item) => (
                <TableRow key={item.batchId} className='hover:bg-gray-50'>
                  <TableCell className='font-medium text-gray-800'>
                    {item.batch.code}
                  </TableCell>
                  <TableCell className='text-gray-600'>
                    {item.batch.code || 'Không xác định'}
                  </TableCell>
                  <TableCell className='text-gray-600'>
                    {item.currentQuantity}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default WarehouseGoods;
