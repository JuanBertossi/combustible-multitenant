import apiClient from "./api/apiClient";
import type { Vehiculo } from "../types";

export const vehiculosService = {
  getAll: async (empresaId: number | null = null): Promise<Vehiculo[]> => {
    const params = empresaId ? { empresaId } : {};
    const response = await apiClient.get<Vehiculo[]>("/vehiculos", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Vehiculo> => {
    const response = await apiClient.get<Vehiculo>(`/vehiculos/${id}`);
    return response.data;
  },

  create: async (data: Partial<Vehiculo>): Promise<Vehiculo> => {
    const response = await apiClient.post<Vehiculo>("/vehiculos", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Vehiculo>): Promise<Vehiculo> => {
    const response = await apiClient.put<Vehiculo>(`/vehiculos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete<void>(`/vehiculos/${id}`);
    return response.data;
  },
};
