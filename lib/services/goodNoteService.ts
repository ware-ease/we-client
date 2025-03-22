import { GoodNote } from '../types/goodNote';
import { axiosGet, baseFilters } from './baseService';

export const getAllGoodReceiveNotes = async (): Promise<GoodNote[]> => {
  const response = await axiosGet(
    '/good-notes' + baseFilters + '&noteType=0',
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
