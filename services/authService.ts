/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosGet, axiosPost } from './baseService';

export const login = (data: any) => axiosPost('/auth/login', data, {});

export const logout = () => axiosPost('/auth/logout', {}, {});

export const getCurrentUser = () => axiosGet('/accounts/me', {});

export const refreshTokens = () => axiosPost('/auth/refresh', {}, {});
