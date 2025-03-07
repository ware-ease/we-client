import { Account } from '../types/account';
import { axiosGet } from './baseService';

export const getAllAccounts = async (): Promise<Account[]> => {
  const response = await axiosGet('/accounts', {});
  return response.data.data;
};
