import apiClient from './api/axios';
import { handleApiError } from './api/error-handler';

export const getClients = async (params?: Record<string, string>) => {
  try {
    const response = await apiClient.get('/clients', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createClient = async (clientData: unknown) => {
  try {
    const response = await apiClient.post('/clients', clientData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateClient = async (id: string, clientData: unknown) => {
  try {
    const response = await apiClient.patch(`/clients/${id}`, clientData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteClient = async (id: string) => {
  try {
    const response = await apiClient.delete(`/clients/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
