import apiClient from './api/apiClient';

export const choferesService = {
  getAll: async (empresaId = null) => {
    const params = empresaId ? { empresaId } : {};
    const response = await apiClient.get('/choferes', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/choferes/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/choferes', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/choferes/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/choferes/${id}`);
    return response.data;
  }
};
