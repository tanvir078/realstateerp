import apiClient from './api/axios';
import { handleApiError } from './api/error-handler';

export const getInstallments = async () => {
  try {
    const response = await apiClient.get('/sales/installments');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createInstallment = async (data: unknown) => {
  try {
    const response = await apiClient.post('/sales/installments', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
