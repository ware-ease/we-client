import { Category } from '../types/category';
import { axiosDelete, axiosGet, axiosPost, axiosPut } from './baseService';

export const getCategoryCount = async (): Promise<number> => {
  const response = await axiosGet('/categories/count', {});
  return response.data.data;
};

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axiosGet('/categories', {});
  return response.data.data.records;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await axiosGet(`/categories/${id}`, {});
  return response.data.data;
};

export const createCategory = async (
  categoryData: Partial<Category>
): Promise<Category> => {
  const response = await axiosPost('/categories', categoryData, {});
  return response.data.data;
};

export const updateCategory = async (
  id: string,
  categoryData: Partial<Category>
): Promise<Category> => {
  const response = await axiosPut(`/categories/${id}`, categoryData, {});
  return response.data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await axiosDelete(`/categories/${id}`, {});
};
