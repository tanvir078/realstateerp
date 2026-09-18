import apiClient from './api/axios';
import { handleApiError } from './api/error-handler';

export const getProjects = async () => {
  try {
    const response = await apiClient.get('/projects');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProjectOptions = async () => {
  try {
    const response = await apiClient.get('/projects/options');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProject = async (id: string) => {
  try {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProjectFinancialSummary = async (id: string) => {
  try {
    const response = await apiClient.get(`/projects/${id}/financial-summary`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createProject = async (projectData: unknown) => {
  try {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateProject = async (id: string, projectData: unknown) => {
  try {
    const response = await apiClient.patch(`/projects/${id}`, projectData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteProject = async (id: string) => {
  try {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUnits = async (projectId?: string) => {
  try {
    const response = await apiClient.get('/projects/units', { params: projectId ? { projectId } : undefined });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getBuildings = async (projectId?: string) => {
  const response = await apiClient.get('/projects/buildings', { params: projectId ? { projectId } : undefined });
  return response.data;
};

export const createBuilding = async (data: unknown) => {
  const response = await apiClient.post('/projects/buildings', data);
  return response.data;
};

export const updateBuilding = async (id: string, data: unknown) => {
  const response = await apiClient.patch(`/projects/buildings/${id}`, data);
  return response.data;
};

export const deleteBuilding = async (id: string) => {
  const response = await apiClient.delete(`/projects/buildings/${id}`);
  return response.data;
};

export const getAvailableParking = async (projectId: string) => {
  try {
    const response = await apiClient.get('/projects/parking/available', { params: { projectId } });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createUnit = async (unitData: unknown) => {
  try {
    const response = await apiClient.post('/projects/units', unitData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const bulkCreateUnits = async (unitData: unknown) => {
  try {
    const response = await apiClient.post('/projects/units/bulk', unitData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProjectMilestones = async (projectId: string) => {
  try {
    const response = await apiClient.get(`/projects/${projectId}/milestones`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createProjectMilestone = async (projectId: string, data: unknown) => {
  try {
    const response = await apiClient.post(`/projects/${projectId}/milestones`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateProjectMilestone = async (id: string, data: unknown) => {
  try {
    const response = await apiClient.patch(`/projects/milestones/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProjectDocuments = async (projectId: string) => {
  try {
    const response = await apiClient.get(`/projects/${projectId}/documents`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createProjectDocument = async (projectId: string, data: unknown) => {
  try {
    const response = await apiClient.post(`/projects/${projectId}/documents`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadProjectDocument = async (projectId: string, title: string, documentType: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("documentType", documentType);
    formData.append("file", file);
    const response = await apiClient.post(`/projects/${projectId}/documents/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteProjectDocument = async (projectId: string, documentId: string) => {
  try {
    const response = await apiClient.delete(`/projects/${projectId}/documents/${documentId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const downloadProjectDocument = async (projectId: string, documentId: string) => {
  const response = await apiClient.get(`/projects/${projectId}/documents/${documentId}/download`, { responseType: "blob" });
  return response.data as Blob;
};

export const updateUnit = async (id: string, unitData: unknown) => {
  try {
    const response = await apiClient.patch(`/projects/units/${id}`, unitData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteUnit = async (id: string) => {
  try {
    const response = await apiClient.delete(`/projects/units/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getLandParcels = async () => {
  const response = await apiClient.get('/projects/land-parcels');
  return response.data;
};

export const createLandParcel = async (data: unknown) => {
  const response = await apiClient.post('/projects/land-parcels', data);
  return response.data;
};

export const updateLandParcel = async (id: string, data: unknown) => {
  const response = await apiClient.patch(`/projects/land-parcels/${id}`, data);
  return response.data;
};

export const getUtilityConnections = async (projectId?: string) => {
  const response = await apiClient.get('/projects/utilities/connections', { params: projectId ? { projectId } : undefined });
  return response.data;
};

export const createUtilityConnection = async (data: unknown) => {
  const response = await apiClient.post('/projects/utilities/connections', data);
  return response.data;
};

export const getUtilityBills = async () => {
  const response = await apiClient.get('/projects/utilities/bills');
  return response.data;
};

export const createUtilityBill = async (data: unknown) => {
  const response = await apiClient.post('/projects/utilities/bills', data);
  return response.data;
};

export const payUtilityBill = async (id: string, amount: number) => {
  const response = await apiClient.patch(`/projects/utilities/bills/${id}/pay`, { amount });
  return response.data;
};

export const getProjectPhotos = async (projectId: string) => {
  try {
    const response = await apiClient.get(`/projects/${projectId}/photos`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadProjectPhoto = async (projectId: string, title: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    const response = await apiClient.post(`/projects/${projectId}/photos/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteProjectPhoto = async (projectId: string, photoId: string) => {
  try {
    const response = await apiClient.delete(`/projects/${projectId}/photos/${photoId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProjectSales = async (projectId: string) => {
  try {
    const response = await apiClient.get(`/sales/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
