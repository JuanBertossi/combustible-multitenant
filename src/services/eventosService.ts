import apiClient from "./api/apiClient";
import type { Evento } from "../types";

interface EventoFilters {
  estado?: string;
  vehiculoId?: number;
  choferId?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

export const eventosService = {
  getAll: async (
    empresaId: number | null = null,
    filters: EventoFilters = {}
  ): Promise<Evento[]> => {
    const params = { empresaId, ...filters };
    const response = await apiClient.get<Evento[]>("/eventos", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Evento> => {
    const response = await apiClient.get<Evento>(`/eventos/${id}`);
    return response.data;
  },

  create: async (data: Partial<Evento>): Promise<Evento> => {
    const response = await apiClient.post<Evento>("/eventos", data);
    return response.data;
  },

  validate: async (id: number, data: Partial<Evento>): Promise<Evento> => {
    const response = await apiClient.put<Evento>(
      `/eventos/${id}/validar`,
      data
    );
    return response.data;
  },

  reject: async (id: number, motivo: string): Promise<Evento> => {
    const response = await apiClient.put<Evento>(`/eventos/${id}/rechazar`, {
      motivo,
    });
    return response.data;
  },

  getPending: async (empresaId: number | null = null): Promise<Evento[]> => {
    const params = empresaId
      ? { empresaId, estado: "Pendiente" }
      : { estado: "Pendiente" };
    const response = await apiClient.get<Evento[]>("/eventos", { params });
    return response.data;
  },
};
