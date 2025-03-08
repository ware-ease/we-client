/* eslint-disable @typescript-eslint/no-explicit-any */
import { Account } from '../types/account';
import { axiosDelete, axiosGet, axiosPost, axiosPut } from './baseService';

export const getAllAccounts = async (): Promise<Account[]> => {
  const response = await axiosGet('/accounts', {});
  return response.data.data;
};

export const getAccountById = async (id: string): Promise<Account> => {
  const response = await axiosGet(`/accounts/${id}`, {});
  return response.data.data;
};

export const createAccount = async (
  accountData: Partial<Account>
): Promise<Account> => {
  const response = await axiosPost('/accounts', accountData, {});
  return response.data.data;
};

export const updateAccount = async (
  id: string,
  accountData: Partial<Account>
): Promise<Account> => {
  const response = await axiosPut(`/accounts/${id}`, accountData, {});
  return response.data.data;
};

export const deleteAccount = async (id: string): Promise<void> => {
  await axiosDelete(`/accounts/${id}`, {});
};

export const changePassword = (data: any) =>
  axiosPut('/accounts/password', data, {});
