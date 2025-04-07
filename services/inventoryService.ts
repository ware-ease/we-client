import { Inventory, PutAwayGood } from '@/types/warehouse';
import { axiosGet, axiosPost } from './baseService';

export const getWarehouseInventoryById = async (
  id: string
): Promise<Inventory> => {
  const response = await axiosGet(`/inventories/${id}`, {});
  return response.data.data;
};

export const putAwayGood = async (data: PutAwayGood) => {
  const response = await axiosPost(`/inventory-location`, data, {});
  return response.data.data;
};
