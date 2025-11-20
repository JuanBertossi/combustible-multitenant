import apiClient from "./api/apiClient";
import type { Surtidor } from "../types";

export const surtidoresService = {
  getAll: async (empresaId: number | null = null): Promise<Surtidor[]> => {
    const params = empresaId ? { empresaId } : {};
    const response = await apiClient.get<Surtidor[]>("/surtidores", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Surtidor> => {
    const response = await apiClient.get<Surtidor>(`/surtidores/${id}`);
    return response.data;
  },

  create: async (data: Partial<Surtidor>): Promise<Surtidor> => {
    const response = await apiClient.post<Surtidor>("/surtidores", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Surtidor>): Promise<Surtidor> => {
    const response = await apiClient.put<Surtidor>(`/surtidores/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete<void>(`/surtidores/${id}`);
    return response.data;
  },
};
