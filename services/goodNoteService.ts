import { GoodNote } from '../types/goodNote';
import { axiosGet, axiosPost, baseFilters } from './baseService';

export const getAllGoodReceiveNotes = async (): Promise<GoodNote[]> => {
  const response = await axiosGet(
    '/good-notes' + baseFilters + '&noteType=0',
    {}
  );
  return response.data.data.records;
};

export const getAllCurrentWarehouseGoodReceiveNotes = async (
  id: string
): Promise<GoodNote[]> => {
  const response = await axiosGet(
    '/good-notes' + baseFilters + '&noteType=0&requestedWarehouseId=' + id,
    {}
  );
  return response.data.data.records;
};

export const getAllGoodIssueNotes = async (): Promise<GoodNote[]> => {
  const response = await axiosGet(
    '/good-notes' + baseFilters + '&noteType=1',
    {}
  );
  return response.data.data.records;
};

export const createGoodNote = async (data: GoodNote): Promise<GoodNote> => {
  const response = await axiosPost('/good-notes', data, {});
  return response.data.data;
};
