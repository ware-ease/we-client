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
export const getInventories = async () => {
  const response = await fetch(`/api/inventories`);
  return response.json();
};

export const getLocations = async (locationId: string) => {
  const response = await fetch(`/api/inventories/locations/${locationId}`);
  return response.json();
};

export const getInventoryById = async (inventoryId: string) => {
  const response = await fetch(`/api/inventories/${inventoryId}`);
  return response.json();
};

export const getBatchLocations = async (batchId: string) => {
  const response = await fetch(`/api/inventories/batch/${batchId}/locations`);
  return response.json();
};
