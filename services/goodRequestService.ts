import { GoodRequest } from '../types/goodRequest';
import { axiosGet, baseFilters } from './baseService';

export const getAllGoodRequests = async (): Promise<GoodRequest[]> => {
  const response = await axiosGet('/good-requests' + baseFilters, {});
  return response.data.data.records;
};

export const getAllGoodReceiveRequests = async (): Promise<GoodRequest[]> => {
  const response = await axiosGet(
    '/good-requests' + baseFilters + '&requestType=0',
    {}
  );
  return response.data.data.records;
};

export const getAllGoodIssueRequests = async (): Promise<GoodRequest[]> => {
  const response = await axiosGet(
    '/good-requests' + baseFilters + '&requestType=1',
    {}
  );
  return response.data.data.records;
};
