import apiClient from './api/axios';

export const getSales = async () => (await apiClient.get('/sales')).data;
