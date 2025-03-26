import { Supplier } from '../types/supplier';
import {
  axiosDelete,
  axiosGet,
  axiosPost,
  axiosPut,
  baseFilters,
} from './baseService';

export const getAllSuppliers = async (): Promise<Supplier[]> => {
  const response = await axiosGet('/suppliers' + baseFilters, {});
  return response.data.data.records;
};

export const getSupplierById = async (id: string): Promise<Supplier> => {
  const response = await axiosGet(`/suppliers/${id}`, {});
  return response.data.data;
};

export const createSupplier = async (
  supplierData: Supplier
): Promise<Supplier> => {
  const response = await axiosPost('/suppliers', supplierData, {});
  return response.data.data;
};

export const updateSupplier = async (
  id: string,
  supplierData: Supplier
): Promise<Supplier> => {
  const response = await axiosPut(`/suppliers/${id}`, supplierData, {});
  return response.data.data;
};

export const deleteSupplier = async (id: string): Promise<unknown> => {
  const response = await axiosDelete(`/suppliers/${id}`, {});
  return response.data.data;
};
