import apiClient from './api/apiClient';

export const usuariosService = {
  getAll: async (empresaId = null) => {
    const params = empresaId ? { empresaId } : {};
    const response = await apiClient.get('/usuarios', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/usuarios/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/usuarios', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/usuarios/${id}`);
    return response.data;
  }
};
