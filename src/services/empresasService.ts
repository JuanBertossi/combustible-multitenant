import apiClient from "./api/apiClient";
import type { Empresa } from "../types";

export const empresasService = {
  getAll: async (): Promise<Empresa[]> => {
    const response = await apiClient.get<Empresa[]>("/empresas");
    return response.data;
  },

  getById: async (id: number): Promise<Empresa> => {
    const response = await apiClient.get<Empresa>(`/empresas/${id}`);
    return response.data;
  },

  create: async (data: Partial<Empresa>): Promise<Empresa> => {
    const response = await apiClient.post<Empresa>("/empresas", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Empresa>): Promise<Empresa> => {
    const response = await apiClient.put<Empresa>(`/empresas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete<void>(`/empresas/${id}`);
    return response.data;
  },
};
