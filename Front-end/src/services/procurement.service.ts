import apiClient from './api/axios';
import { handleApiError } from './api/error-handler';

export const getVendors = async () => { try { return (await apiClient.get('/procurement/vendors')).data; } catch (error) { throw handleApiError(error); } };
export const createVendor = async (data: unknown) => { try { return (await apiClient.post('/procurement/vendors', data)).data; } catch (error) { throw handleApiError(error); } };
export const getVendorTypes = async () => { try { return (await apiClient.get('/procurement/vendor-types')).data; } catch (error) { throw handleApiError(error); } };
export const createVendorType = async (data: unknown) => { try { return (await apiClient.post('/procurement/vendor-types', data)).data; } catch (error) { throw handleApiError(error); } };
export const getVendorBills = async () => { try { return (await apiClient.get('/procurement/vendor-bills')).data; } catch (error) { throw handleApiError(error); } };
export const createVendorBill = async (data: unknown) => { try { return (await apiClient.post('/procurement/vendor-bills', data)).data; } catch (error) { throw handleApiError(error); } };
export const payVendorBill = async (data: unknown) => { try { return (await apiClient.post('/procurement/vendor-bills/pay', data)).data; } catch (error) { throw handleApiError(error); } };
export const postVendorBill = async (id: string) => { try { return (await apiClient.post(`/procurement/vendor-bills/${id}/post`)).data; } catch (error) { throw handleApiError(error); } };
export const getPurchaseOrders = async () => { try { return (await apiClient.get('/procurement/purchase-orders')).data; } catch (error) { throw handleApiError(error); } };
export const getPurchaseRequisitions = async () => { try { return (await apiClient.get('/procurement/requisitions')).data; } catch (error) { throw handleApiError(error); } };
export const approvePurchaseOrder = async (id: string) => { try { return (await apiClient.post(`/procurement/purchase-orders/${id}/approve`)).data; } catch (error) { throw handleApiError(error); } };
export const createPurchaseOrder = async (data: unknown) => { try { return (await apiClient.post('/procurement/purchase-orders', data)).data; } catch (error) { throw handleApiError(error); } };
