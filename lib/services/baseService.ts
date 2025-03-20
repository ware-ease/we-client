/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const baseFilters = '?pageIndex=1&pageSize=1000';

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export const axiosGet = (path: string, config: any) =>
  axiosInstance.get(baseUrl + path, config);

export const axiosPost = (path: string, data: any, config: any) =>
  axiosInstance.post(baseUrl + path, data, config);

export const axiosPut = (path: string, data: any, config: any) =>
  axiosInstance.put(baseUrl + path, data, config);

export const axiosPatch = (path: string, data: any, config: any) =>
  axiosInstance.patch(baseUrl + path, data, config);

export const axiosDelete = (path: string, config: any) =>
  axiosInstance.delete(baseUrl + path, config);
