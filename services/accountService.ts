/* eslint-disable @typescript-eslint/no-explicit-any */
import { Permission } from '@/types/permission';
import { Account, AccountUpdate, Group } from '../types/account';
import {
  axiosDelete,
  axiosGet,
  axiosPatch,
  axiosPost,
  axiosPut,
} from './baseService';

export const getAllAccounts = async (): Promise<Account[]> => {
  const response = await axiosGet('/accounts', {});
  return response.data.data;
};

export const getAllPermissions = async (): Promise<Permission[]> => {
  const response = await axiosGet('/permissions', {});
  return response.data.data;
};

export const getAllGroups = async (): Promise<Group[]> => {
  const response = await axiosGet('/groups', {});
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

export const updateAccount = async (accountData: Partial<AccountUpdate>) => {
  const response = await axiosPatch(
    `/accounts/${accountData.id}`,
    accountData,
    {}
  );
  return response.data.data;
};

export const updateAccountStatus = async (id: string, status: number) => {
  const response = await axiosPut(
    `/accounts/${id}/status?status=${status}`,
    {},
    {}
  );
  return response.data.data;
};

export const deleteAccount = async (id: string): Promise<void> => {
  await axiosDelete(`/accounts/${id}`, {});
};

export const changePassword = (data: any) =>
  axiosPut('/accounts/password', data, {});
