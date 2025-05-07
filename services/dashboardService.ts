// import { axiosGet } from './baseService';

// export const getDashboardCards = async (): Promise<
//   Record<string, unknown>[]
// > => {
//   const response = await axiosGet('/dashboard/4cards', {});
//   return response.data.data;
// };

// export const getDashboardHistogram = async (): Promise<
//   Record<string, unknown>[]
// > => {
//   const response = await axiosGet('/dashboard/histogram', {});
//   return response.data.data;
// };

// export const getDashboardLineChart = async (): Promise<
//   Record<string, unknown>[]
// > => {
//   const response = await axiosGet('/dashboard/linechart', {});
//   return response.data.data;
// };

// export const getDashboardPieChart = async (): Promise<
//   Record<string, unknown>[]
// > => {
//   const response = await axiosGet('/dashboard/piechart', {});
//   return response.data.data;
// };

////

import { axiosGet } from './baseService';

export const getDashboardCards = async (warehouseId?: string) => {
  const url = warehouseId
    ? `/dashboard/4cards?warehouseId=${warehouseId}`
    : `/dashboard/4cards`;
  const response = await axiosGet(url, {});
  return response.data.data;
};

export const getDashboardHistogram = async (warehouseId?: string) => {
  const url = warehouseId
    ? `/dashboard/histogram?warehouseId=${warehouseId}`
    : `/dashboard/histogram`;
  const response = await axiosGet(url, {});
  return response.data;
};

export const getDashboardLineChart = async (warehouseId?: string) => {
  const url = warehouseId
    ? `/dashboard/linechart?warehouseId=${warehouseId}`
    : `/dashboard/linechart`;
  const response = await axiosGet(url, {});
  return response.data;
};

export const getDashboardPieChart = async (warehouseId?: string) => {
  const url = warehouseId
    ? `/dashboard/piechart/warehouse/${warehouseId}`
    : `/dashboard/piechart`;
  const response = await axiosGet(url, {});
  return response.data;
};
