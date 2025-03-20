import { Batch } from '../types/batch';
import {
  axiosDelete,
  axiosGet,
  axiosPost,
  axiosPut,
  baseFilters,
} from './baseService';

export const getBatchCount = async (): Promise<number> => {
  const response = await axiosGet('/batches/count', {});
  return response.data.data;
};

export const getAllBatches = async (): Promise<Batch[]> => {
  const response = await axiosGet('/batches' + baseFilters, {});
  return response.data.data.records;
};

export const getBatchById = async (id: string): Promise<Batch> => {
  const response = await axiosGet(`/batches/${id}`, {});
  return response.data.data;
};

export const createBatch = async (
  batchData: Partial<Batch>
): Promise<Batch> => {
  const response = await axiosPost('/batches', batchData, {});
  return response.data.data;
};

export const updateBatch = async (
  id: string,
  batchData: Partial<Batch>
): Promise<Batch> => {
  const response = await axiosPut(`/batches/${id}`, batchData, {});
  return response.data.data;
};

export const deleteBatch = async (id: string): Promise<void> => {
  await axiosDelete(`/batches/${id}`, {});
};
