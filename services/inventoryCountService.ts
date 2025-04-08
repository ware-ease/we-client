import { InventoryCount } from '../types/inventoryCount';
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
  baseFilters,
} from './baseService';

// Lấy tất cả inventory counts
export const getAllInventoryCounts = async (): Promise<InventoryCount[]> => {
  const response = await axiosGet(`/api/inventory-counts${baseFilters}`, {});
  return response.data.data.records;
};

// Lấy inventory count theo ID
export const getInventoryCountById = async (
  id: string
): Promise<InventoryCount> => {
  const response = await axiosGet(`/api/inventory-counts/${id}`, {});
  return response.data.data;
};

// Tạo inventory count mới
export const createInventoryCount = async (
  data: InventoryCount
): Promise<InventoryCount> => {
  const response = await axiosPost('/api/inventory-counts', data, {});
  return response.data.data;
};

// Cập nhật inventory count
export const updateInventoryCount = async (
  id: string,
  data: InventoryCount
): Promise<InventoryCount> => {
  const response = await axiosPatch(`/api/inventory-counts/${id}`, data, {});
  return response.data.data;
};

// Xóa inventory count
export const deleteInventoryCount = async (id: string): Promise<void> => {
  await axiosDelete(`/api/inventory-counts/${id}`, {});
};
