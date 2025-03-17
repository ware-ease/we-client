import { Product } from '../types/product';
import { axiosGet } from './baseService';

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await axiosGet('/products', {});
  return response.data.data;
};
