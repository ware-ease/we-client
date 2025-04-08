import InventoryCountTable from '@/components/custom-table/inventory-count/InventoryCountTable';

const WarehouseCheckInventories = () => {
  return (
    <div className='flex flex-col p-4 gap-6'>
      <div className='text-4xl font-semibold text-primary'>
        Biên bản kiểm kê
      </div>
      <InventoryCountTable onlyCurrentWarehouse />
    </div>
  );
};

export default WarehouseCheckInventories;
