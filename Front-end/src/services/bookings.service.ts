import apiClient from './api/axios';
import { handleApiError } from './api/error-handler';

export const getBookings = async () => {
  try {
    const response = await apiClient.get('/sales');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createBooking = async (bookingData: unknown) => {
  try {
    const response = await apiClient.post('/sales', bookingData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const confirmBooking = async (id: string) => {
  try {
    const response = await apiClient.post(`/sales/${id}/confirm`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const cancelBooking = async (id: string) => {
  try {
    const response = await apiClient.post(`/sales/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const refundBooking = async (id: string, refundData: {
  amount: number;
  paymentMethod: string;
  refundDate: string;
  referenceNo?: string;
}) => {
  try {
    const response = await apiClient.post(`/sales/${id}/refund`, refundData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
