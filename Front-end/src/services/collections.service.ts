import apiClient from './api/axios';
import { handleApiError } from './api/error-handler';

export const collectPayment = async (data: unknown) => {
  try {
    const response = await apiClient.post('/sales/collections', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCollections = async () => {
  try {
    const response = await apiClient.get('/sales/collections');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
