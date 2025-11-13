import apiClient from "./api/apiClient";
import type { Usuario } from "../types";

export const usuariosService = {
  getAll: async (empresaId: number | null = null): Promise<Usuario[]> => {
    const params = empresaId ? { empresaId } : {};
    const response = await apiClient.get<Usuario[]>("/usuarios", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Usuario> => {
    const response = await apiClient.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  create: async (data: Partial<Usuario>): Promise<Usuario> => {
    const response = await apiClient.post<Usuario>("/usuarios", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Usuario>): Promise<Usuario> => {
    const response = await apiClient.put<Usuario>(`/usuarios/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete<void>(`/usuarios/${id}`);
    return response.data;
  },
};
