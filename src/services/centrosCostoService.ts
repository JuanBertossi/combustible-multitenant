import apiClient from "./api/apiClient";
import type { CentroCosto } from "../types";

export const centrosCostoService = {
  getAll: async (empresaId: number | null = null): Promise<CentroCosto[]> => {
    const params = empresaId ? { empresaId } : {};
    const response = await apiClient.get<CentroCosto[]>("/centros-costo", {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<CentroCosto> => {
    const response = await apiClient.get<CentroCosto>(`/centros-costo/${id}`);
    return response.data;
  },

  create: async (data: Partial<CentroCosto>): Promise<CentroCosto> => {
    const response = await apiClient.post<CentroCosto>("/centros-costo", data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<CentroCosto>
  ): Promise<CentroCosto> => {
    const response = await apiClient.put<CentroCosto>(
      `/centros-costo/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    const response = await apiClient.delete<void>(`/centros-costo/${id}`);
    return response.data;
  },

  // Método para obtener centros de costo por tipo
  getByTipo: async (
    tipo: string,
    empresaId: number | null = null
  ): Promise<CentroCosto[]> => {
    const params = empresaId ? { tipo, empresaId } : { tipo };
    const response = await apiClient.get<CentroCosto[]>("/centros-costo", {
      params,
    });
    return response.data;
  },
};
