import { GoodRequest } from '../types/goodRequest';
import { axiosGet, axiosPost, axiosPut, baseFilters } from './baseService';

export const getAllGoodRequests = async (): Promise<GoodRequest[]> => {
  const response = await axiosGet('/good-requests' + baseFilters, {});
  return response.data.data.records;
};

export const getGoodRequestById = async (id: string): Promise<GoodRequest> => {
  const response = await axiosGet('/good-requests/' + id, {});
  return response.data.data;
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

export const createGoodRequest = async (
  data: GoodRequest
): Promise<GoodRequest> => {
  const response = await axiosPost('/good-requests', data, {});
  return response.data.data;
};

export const confirmGoodRequest = async (id: string): Promise<GoodRequest> => {
  const response = await axiosPut(
    '/good-requests/' + id + '/status?requestStatus=1',
    {},
    {}
  );
  return response.data.data;
};
