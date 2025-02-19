/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosPost } from './baseService';

export const login = (data: any) => axiosPost('/auth/login', data, '');
