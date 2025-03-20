/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const baseFilters = '?pageIndex=1&pageSize=1000';

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

const axiosRefreshInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await axiosRefreshInstance.post(baseUrl + '/auth/refresh');
      const res = await axios.request(error.config);

      if (res.status !== 401) return res;
    }

    return Promise.reject(error);
  }
);

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
