import apiClient from './api/apiClient';

export const vehiculosService = {
  getAll: async (empresaId = null) => {
    const params = empresaId ? { empresaId } : {};
    const response = await apiClient.get('/vehiculos', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/vehiculos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/vehiculos', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/vehiculos/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/vehiculos/${id}`);
    return response.data;
  }
};
