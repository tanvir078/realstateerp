import apiClient from './api/axios';
import { handleApiError } from './api/error-handler';
const request = async (method: 'get' | 'post' | 'patch' | 'delete', path: string, data?: unknown) => { try { const response = await apiClient[method](path, data); return response.data; } catch (error) { throw handleApiError(error); } };
export const getMRNs = () => request('get', '/construction/mrns'); export const createMRN = (data: unknown) => request('post', '/construction/mrns', data); export const approveMRN = (id: string) => request('post', `/construction/mrns/${id}/approve`);
export const getRABills = () => request('get', '/construction/ra-bills'); export const createRABill = (data: unknown) => request('post', '/construction/ra-bills', data); export const approveRABill = (id: string) => request('post', `/construction/ra-bills/${id}/approve`); export const postRABill = (id: string) => request('post', `/construction/ra-bills/${id}/post`); export const payRABill = (data: unknown) => request('post', '/construction/ra-bills/pay', data);
export const getContractors = () => request('get', '/construction/contractors');
export const createContractor = (data: unknown) => request('post', '/construction/contractors', data);
export const updateContractor = (id: string, data: unknown) => request('patch', `/construction/contractors/${id}`, data);
export const deleteContractor = (id: string) => request('delete', `/construction/contractors/${id}`);
export const getWorkOrders = () => request('get', '/construction/work-orders');
export const createWorkOrder = (data: unknown) => request('post', '/construction/work-orders', data);
export const updateWorkOrder = (id: string, data: unknown) => request('patch', `/construction/work-orders/${id}`, data);
export const deleteWorkOrder = (id: string) => request('delete', `/construction/work-orders/${id}`);
export const approveWorkOrder = (id: string) => request('post', `/construction/work-orders/${id}/approve`);
export const getEquipment = () => request('get', '/construction/equipment');
export const createEquipment = (data: unknown) => request('post', '/construction/equipment', data);
export const getFuelLogs = () => request('get', '/construction/fuel-logs');
export const createFuelLog = (data: unknown) => request('post', '/construction/fuel-logs', data);
export const getLabor = () => request('get', '/construction/labor');
export const createLabor = (data: unknown) => request('post', '/construction/labor', data);
export const approveLabor = (id: string) => request('post', `/construction/labor/${id}/approve`);
export const disburseLabor = (id: string, data: unknown) => request('post', `/construction/labor/${id}/disburse`, data);


export const getConstructionDashboard = async () => {
  try {
    const response = await apiClient.get('/construction/dashboard');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
