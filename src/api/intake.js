import { axiosFactory } from './api';

const api = axiosFactory('api/v1/intakes/');

export const getIntake = (id) => api.get(`${id}`);

export const getIntakes = () => api.get();

export const updateIntake = (id, payload) => api.put(`${id}`, payload);

export const approveIntake = (id, payload) => api.put(`${id}/approve`, payload);
