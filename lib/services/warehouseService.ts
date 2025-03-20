import { Warehouse } from '../types/warehouse';
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from './baseService';

export const getAllWarehouses = async (): Promise<Warehouse[]> => {
  const response = await axiosGet('/warehouses', {});
  return response.data.data.records;
};

export const getWarehouseById = async (id: string): Promise<Warehouse> => {
  const response = await axiosGet(`/warehouses/${id}`, {});
  return response.data.data;
};

export const createWarehouse = async (
  warehouseData: Partial<Warehouse>
): Promise<Warehouse> => {
  const response = await axiosPost('/warehouses', warehouseData, {});
  return response.data.data;
};

export const updateWarehouse = async (
  id: string,
  warehouseData: Partial<Warehouse>
): Promise<Warehouse> => {
  const response = await axiosPatch(`/warehouses/${id}`, warehouseData, {});
  return response.data.data;
};

export const deleteWarehouse = async (id: string): Promise<void> => {
  await axiosDelete(`/warehouses/${id}`, {});
};
