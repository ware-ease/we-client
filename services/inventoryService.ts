import { Inventory } from '@/types/warehouse';
// import { axiosGet } from './baseService';

export const getWarehouseInventoryById = async (
  id: string
): Promise<Inventory> => {
  // const response = await axiosGet(`/warehouses/${id}/inventory`, {});
  // return response.data.data;
  console.log('getWarehouseInventoryById', id);

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return fake response for `/warehouses/${id}/inventory`
  return {
    id: '1b485996-92a6-43ee-ada9-7f4aaa9e5299',
    currentQuantity: 5,
    batchId: 'batch789',
    batch: {
      id: 'batch789',
      productId: '',
      name: '',
      mfgDate: '',
      expDate: '',
      code: 'VCXIMANG01324',
      // Add other Batch fields if needed (e.g., expiryDate, productId)
    },
  };
};
