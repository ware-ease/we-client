import { Supplier } from '../types/supplier';
import { axiosDelete, axiosGet, axiosPost, axiosPut } from './baseService';

export const data: Supplier[] = [
  {
    id: '1',
    name: 'ABC Supplies',
    email: 'contact@abcsupplies.com',
    phone: '123-456-7890',
    address: '123 Warehouse St, NY',
    status: 'active',
  },
  {
    id: '2',
    name: 'Global Distributors',
    email: 'info@globaldist.com',
    phone: '098-765-4321',
    address: '456 Market Ave, CA',
    status: 'inactive',
  },
  {
    id: '3',
    name: 'Tech Wholesale',
    email: 'support@techwholesale.com',
    phone: '555-123-4567',
    address: '789 Silicon Valley, TX',
    status: 'active',
  },
  {
    id: '4',
    name: 'Food Supplies Co.',
    email: 'sales@foodsupplies.com',
    phone: '444-987-6543',
    address: '101 Farm Road, FL',
    status: 'banned',
  },
];

export const getSuppliers = (): Promise<Supplier[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
};

export const getAllSuppliers = async (): Promise<Supplier[]> => {
  const response = await axiosGet('/suppliers', {});
  return response.data.data.records;
};

export const getSupplierById = async (id: string): Promise<Supplier> => {
  const response = await axiosGet(`/suppliers/${id}`, {});
  return response.data.data;
};

export const createSupplier = async (
  supplierData: Partial<Supplier>
): Promise<Supplier> => {
  const response = await axiosPost('/suppliers', supplierData, {});
  return response.data.data;
};

export const updateSupplier = async (
  id: string,
  supplierData: Partial<Supplier>
): Promise<Supplier> => {
  const response = await axiosPut(`/suppliers/${id}`, supplierData, {});
  return response.data.data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  await axiosDelete(`/suppliers/${id}`, {});
};
