import { Product, ProductType } from '../types/product';
import { ProductCreate } from '../types/request/product';
import { axiosGet, axiosPost, baseFilters } from './baseService';

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await axiosGet('/products' + baseFilters, {});
  return response.data.data.records;
};

export const createProduct = async (
  data: ProductCreate
): Promise<ProductCreate> => {
  const response = await axiosPost('/products', data, {});
  return response.data.data;
};

export const getProductCount = async (): Promise<number> => {
  const response = await axiosGet('/products/count', {});
  return response.data.data;
};

export const getBatchCount = async (): Promise<number> => {
  const response = await axiosGet('/batches/count', {});
  return response.data.data;
};

export const getCategoryCount = async (): Promise<number> => {
  const response = await axiosGet('/categories/count', {});
  return response.data.data;
};

export const getProductTypeCount = async (): Promise<number> => {
  const response = await axiosGet('/product-types/count', {});
  return response.data.data;
};

export const getAllProductTypes = async (): Promise<ProductType[]> => {
  const response = await axiosGet('/product-types', {});
  return response.data.data.records;
};
