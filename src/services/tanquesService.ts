import apiClient from "./api/apiClient";
import type { Tanque } from "../types";

export const tanquesService = {
  getAll: async (empresaId: number | null = null): Promise<Tanque[]> => {
    const params = empresaId ? { empresaId } : {};
    const response = await apiClient.get<Tanque[]>("/tanques", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Tanque> => {
    const response = await apiClient.get<Tanque>(`/tanques/${id}`);
    return response.data;
  },

  create: async (data: Partial<Tanque>): Promise<Tanque> => {
    const response = await apiClient.post<Tanque>("/tanques", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Tanque>): Promise<Tanque> => {
    const response = await apiClient.put<Tanque>(`/tanques/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete<void>(`/tanques/${id}`);
    return response. data;
  },

  // Método específico para actualizar nivel
  updateNivel: async (id: number, nivelActual: number): Promise<Tanque> => {
    const response = await apiClient.patch<Tanque>(`/tanques/${id}/nivel`, {
      nivelActual,
    });
    return response.data;
  },
};
