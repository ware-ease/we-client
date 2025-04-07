import { Warehouse } from '@/types/warehouse';
import { axiosGet } from './baseService';

export const getWarehouseInventoryById = async (
  id: string
): Promise<Warehouse> => {
  const response = await axiosGet(`/warehouses/${id}/inventory`, {});
  return response.data.data;
};
