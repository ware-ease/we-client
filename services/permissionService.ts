import { Permission } from '../types/permission';
import { axiosGet } from './baseService';

export const getPermissions = async (): Promise<Permission[]> => {
  const response = await axiosGet('/permissions', {});
  return response.data.data;
};
