'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useInventoryById } from '@/hooks/queries/inventoryQueries'; // Assumed hook
import { useWarehouseById } from '@/hooks/queries/warehouseQueries'; // Assumed hook
import PutawayDialog from '@/components/dialogs/PutAwayDialog';

const InventoryDetail: React.FC = () => {
  const { warehouseId, inventoryId } = useParams<{
    warehouseId: string;
    inventoryId: string;
  }>();

  // Fetch inventory details
  const { data: inventory, isLoading: inventoryLoading } =
    useInventoryById(inventoryId);

  // Fetch warehouse with locations
  const { data: warehouse, isLoading: warehouseLoading } =
    useWarehouseById(warehouseId);

  if (inventoryLoading || warehouseLoading) {
    return <div>Đang tải...</div>;
  }

  if (!inventory) {
    return <div>Không tìm thấy thông tin tồn kho.</div>;
  }

  if (!warehouse) {
    return <div>Không tìm thấy thông tin kho.</div>;
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Chi tiết tồn kho</h1>

      {/* Inventory Details */}
      <div className='bg-white shadow rounded-lg p-4 mb-6'>
        <h2 className='text-lg font-semibold mb-2'>Thông tin tồn kho</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <strong>Mã sản phẩm (SKU):</strong>{' '}
            {inventory.batch.product?.sku || 'N/A'}
          </div>
          <div>
            <strong>Tên sản phẩm:</strong>{' '}
            {inventory.batch.product?.name || 'N/A'}
          </div>
          <div>
            <strong>Mã lô:</strong> {inventory.batch?.code || inventory.batchId}
          </div>
          <div>
            <strong>Tên lô:</strong> {inventory.batch?.name || 'N/A'}
          </div>
          <div>
            <strong>Tổng số lượng:</strong>{' '}
            {inventory.currentQuantity.toLocaleString('vi-VN')}
          </div>
          <div>
            <strong>Kho:</strong> {warehouse.name}
          </div>
        </div>
      </div>

      {/* Putaway Dialog */}
      <PutawayDialog
        warehouse={warehouse}
        inventory={inventory}
        inventoryLocations={inventory.inventoryLocations || []}
      />
    </div>
  );
};

export default InventoryDetail;
