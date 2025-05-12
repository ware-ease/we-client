import { InventoryAdjustment } from '@/types/warehouse';
import { axiosPost } from './baseService';

export const createInventoryAdjustment = async (
  data: InventoryAdjustment
): Promise<InventoryAdjustment> => {
  const response = await axiosPost('/inventory-adjustments', data, {});
  return response.data.data;
};
