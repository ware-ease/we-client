import { GoodRequest } from '../types/goodRequest';
import { axiosGet, baseFilters } from './baseService';

export const getAllGoodRequests = async (): Promise<GoodRequest[]> => {
  const response = await axiosGet('/good-requests' + baseFilters, {});
  return response.data.data;
};

export const getAllGoodReceiveRequests = async (): Promise<GoodRequest[]> => {
  const response = await axiosGet(
    '/good-requests' + baseFilters + '&type=0',
    {}
  );
  return response.data.data.records;
};
