import { GoodRequest } from '../types/goodRequest';
import { axiosGet } from './baseService';

export const getAllGoodRequests = async (): Promise<GoodRequest[]> => {
  const response = await axiosGet('/good-requests', {});
  return response.data.data;
};

export const getAllGoodReceiveRequests = async (): Promise<GoodRequest[]> => {
  const response = await axiosGet('/good-requests?type=0', {});
  return response.data.data.records;
};
