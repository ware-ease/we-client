import { GoodNote, GoodReceiveNote } from '../types/goodNote';
import { axiosGet, axiosPatch, axiosPost, baseFilters } from './baseService';

export const getAllGoodReceiveNotes = async (): Promise<GoodNote[]> => {
  const response = await axiosGet(
    '/good-notes' + baseFilters + '&noteType=0',
    {}
  );
  return response.data.data.records;
};

export const getGoodNoteById = async (id: string): Promise<GoodNote> => {
  const response = await axiosGet('/good-notes/' + id, {});
  return response.data.data;
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

export const getGoodIssueNoteById = async (id: string): Promise<GoodNote> => {
  const response = await axiosGet('/good-notes/' + id, {});
  return response.data.data;
};

export const getAllCurrentWarehouseGoodIssueNotes = async (
  id: string
): Promise<GoodNote[]> => {
  const response = await axiosGet(
    '/good-notes' + baseFilters + '&noteType=1&requestedWarehouseId=' + id,
    {}
  );
  return response.data.data.records;
};

export const createGoodNote = async (data: GoodNote): Promise<GoodNote> => {
  const response = await axiosPost('/good-notes', data, {});
  return response.data.data;
};

export const createGoodReceiveNote = async (
  data: GoodReceiveNote
): Promise<GoodReceiveNote> => {
  const response = await axiosPost('/good-notes/receive-note', data, {});
  return response.data.data;
};

export const createGoodIssueNote = async (
  data: GoodNote
): Promise<GoodNote> => {
  const response = await axiosPost('/good-notes/issue-note', data, {});
  return response.data.data;
};

export const updateGoodNote = async (data: GoodNote): Promise<GoodNote> => {
  const response = await axiosPatch('/good-notes/' + data.id, data, {});
  return response.data.data;
};
