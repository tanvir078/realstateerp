import apiClient from './api/axios';
import { handleApiError } from './api/error-handler';

export const getInvoices = async () => {
  try {
    const response = await apiClient.get('/sales/invoices');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createInvoice = async (data: unknown) => {
  try {
    const response = await apiClient.post('/sales/invoices', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
