import { Inventory, PutAwayGood } from '@/types/warehouse';
import { axiosGet, axiosPost } from './baseService';

export const getWarehouseInventoryById = async (
  id: string
): Promise<Inventory> => {
  const response = await axiosGet(`/inventories/${id}`, {});
  return response.data.data;
};

export const putAwayGood = async (data: PutAwayGood) => {
  const response = await axiosPost(`/inventories/inventory-location`, data, {});
  return response.data.data;
};

export const getWarehouseInventories = async (
  warehouseId: string
): Promise<Inventory[]> => {
  const response = await axiosGet(
    `/inventories?warehouseId=${warehouseId}`,
    {}
  );
  return response.data.data;
};
