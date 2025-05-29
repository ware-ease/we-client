import { Customer } from '../types/customer';
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
  baseFilters
} from './baseService';

export const getAllCustomers = async (): Promise<Customer[]> => {
  const response = await axiosGet('/customers' + baseFilters, {});
  return response.data.data.records;
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const response = await axiosGet(`/customers/${id}`, {});
  return response.data.data;
};

export const createCustomer = async (
  customerData: Partial<Customer>
): Promise<Customer> => {
  const response = await axiosPost('/customers', customerData, {});
  return response.data.data;
};

export const updateCustomer = async (
  id: string,
  customerData: Partial<Customer>
): Promise<Customer> => {
  const response = await axiosPatch(`/customers/${id}`, customerData, {});
  return response.data.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await axiosDelete(`/customers/${id}`, {});
};
