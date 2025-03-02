/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosGet, axiosPost } from './baseService';

export const login = (data: any) => axiosPost('/auth/login', data, {});

export const getCurrentUser = () => axiosGet('/accounts/me', {});
