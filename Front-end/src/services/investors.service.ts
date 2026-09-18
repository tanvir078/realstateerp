import apiClient from './api/axios';

export const getInvestors = async () => (await apiClient.get('/investors')).data;
export const createInvestor = async (data: unknown) => (await apiClient.post('/investors', data)).data;
export const getInvestorAllocations = async () => (await apiClient.get('/investors/allocations')).data;
export const createInvestorAllocation = async (data: unknown) => (await apiClient.post('/investors/allocations', data)).data;
export const getInvestorPayouts = async () => (await apiClient.get('/investors/payouts')).data;
export const createInvestorPayout = async (data: unknown) => (await apiClient.post('/investors/payouts', data)).data;
export const processInvestorPayout = async (id: string, data: unknown) => (await apiClient.post(`/investors/payouts/${id}/process`, data)).data;


export const getInvestorsDashboard = async () => {
  try {
    const response = await apiClient.get('/investors/dashboard');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
