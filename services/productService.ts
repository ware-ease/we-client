import { Product, ProductType } from '../types/product';
import { ProductCreate } from '../types/request/product';
import {
  axiosDelete,
  axiosGet,
  axiosPost,
  axiosPut,
  baseFilters,
} from './baseService';

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await axiosGet('/products' + baseFilters, {});
  return response.data.data.records;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosGet('/products/' + id, {});
  return response.data.data;
};

export const createProduct = async (
  data: ProductCreate
): Promise<ProductCreate> => {
  const response = await axiosPost('/products', data, {});
  return response.data.data;
};

export const deleteProduct = async (id: string): Promise<unknown> => {
  const response = await axiosDelete(`/products/${id}`, {});
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
  const response = await axiosGet('/product-types' + baseFilters, {});
  return response.data.data.records;
};

export const createProductType = async (
  data: ProductType
): Promise<ProductType> => {
  const response = await axiosPost('/product-types', data, {});
  return response.data.data;
};

export const getProductTypeById = async (id: string): Promise<ProductType> => {
  const response = await axiosGet(`/product-types/${id}`, {});
  return response.data.data;
};

export const updateProductType = async (
  id: string,
  data: ProductType
): Promise<ProductType> => {
  const response = await axiosPut(`/product-types/${id}`, data, {});
  return response.data.data;
};

export const deleteProductType = async (id: string): Promise<void> => {
  await axiosDelete(`/product-types/${id}`, {});
};
