import { axiosFactory } from './api';

const api = axiosFactory('api/v1/packages/');

export const getPackage = (id) => api.get(`${id}`);

export const getIntakes = () => api.get();
