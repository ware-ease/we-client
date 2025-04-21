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

export const getDashboardCards = async () => {
  const response = await axiosGet('/dashboard/4cards', {});
  return response.data.data;
};

export const getDashboardHistogram = async () => {
  const response = await axiosGet('/dashboard/histogram', {});
  return response;
};

export const getDashboardLineChart = async () => {
  const response = await axiosGet('/dashboard/linechart', {});
  return response;
};

export const getDashboardPieChart = async () => {
  const response = await axiosGet('/dashboard/piechart', {});
  return response;
};
