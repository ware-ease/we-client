import { Unit } from '../types/unit';
import { axiosDelete, axiosGet, axiosPost, axiosPut } from './baseService';

export const getAllUnits = async (): Promise<Unit[]> => {
  const response = await axiosGet('/units', {});
  return response.data.data;
};

export const getUnitById = async (id: string): Promise<Unit> => {
  const response = await axiosGet(`/units/${id}`, {});
  return response.data.data;
};

export const createUnit = async (unitData: Partial<Unit>): Promise<Unit> => {
  const response = await axiosPost('/units', unitData, {});
  return response.data.data;
};

export const updateUnit = async (
  id: string,
  unitData: Partial<Unit>
): Promise<Unit> => {
  const response = await axiosPut(`/units/${id}`, unitData, {});
  return response.data.data;
};

export const deleteUnit = async (id: string): Promise<void> => {
  await axiosDelete(`/units/${id}`, {});
};
