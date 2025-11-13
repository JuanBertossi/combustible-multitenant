import apiClient from "./api/apiClient";
import type { Chofer } from "../types";

export const choferesService = {
  getAll: async (empresaId: number | null = null): Promise<Chofer[]> => {
    const params = empresaId ? { empresaId } : {};
    const response = await apiClient.get<Chofer[]>("/choferes", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Chofer> => {
    const response = await apiClient.get<Chofer>(`/choferes/${id}`);
    return response.data;
  },

  create: async (data: Partial<Chofer>): Promise<Chofer> => {
    const response = await apiClient.post<Chofer>("/choferes", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Chofer>): Promise<Chofer> => {
    const response = await apiClient.put<Chofer>(`/choferes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete<void>(`/choferes/${id}`);
    return response.data;
  },
};
