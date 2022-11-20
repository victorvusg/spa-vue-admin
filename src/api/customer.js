import { axiosFactory } from './api';

const api = axiosFactory('api/v1/customers/');

export const getCustomer = (id) => api.get(`${id}`);

export const getCustomers = () => api.get();

export const updateIntake = (id, payload) => api.put(`${id}`, payload);

export const approveIntake = (id, payload) => api.put(`${id}/approve`, payload);
