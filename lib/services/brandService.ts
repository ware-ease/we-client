import { Brand } from '../types/brand';
import { axiosDelete, axiosGet, axiosPost, axiosPut } from './baseService';

export const getAllBrands = async (): Promise<Brand[]> => {
  const response = await axiosGet('/brands', {});
  return response.data.data.records;
};

export const getBrandById = async (id: string): Promise<Brand> => {
  const response = await axiosGet(`/brands/${id}`, {});
  return response.data.data;
};

export const createBrand = async (
  brandData: Partial<Brand>
): Promise<Brand> => {
  const response = await axiosPost('/brands', brandData, {});
  return response.data.data;
};

export const updateBrand = async (
  id: string,
  brandData: Partial<Brand>
): Promise<Brand> => {
  const response = await axiosPut(`/brands/${id}`, brandData, {});
  return response.data.data;
};

export const deleteBrand = async (id: string): Promise<void> => {
  await axiosDelete(`/brands/${id}`, {});
};
