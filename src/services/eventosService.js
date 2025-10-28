import apiClient from './api/apiClient';

export const eventosService = {
  getAll: async (empresaId = null, filters = {}) => {
    const params = { empresaId, ...filters };
    const response = await apiClient.get('/eventos', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/eventos/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/eventos', data);
    return response.data;
  },

  validate: async (id, data) => {
    const response = await apiClient.put(`/eventos/${id}/validar`, data);
    return response.data;
  },

  reject: async (id, motivo) => {
    const response = await apiClient.put(`/eventos/${id}/rechazar`, { motivo });
    return response.data;
  },

  getPending: async (empresaId = null) => {
    const params = empresaId ? { empresaId, estado: 'Pendiente' } : { estado: 'Pendiente' };
    const response = await apiClient.get('/eventos', { params });
    return response.data;
  }
};
