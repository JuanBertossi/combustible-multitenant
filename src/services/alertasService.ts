import apiClient from "./api/apiClient";
import type { ConfiguracionAlerta, Alerta } from "../types/reports";

/**
 * Servicio para gestionar configuración de alertas
 */

// ============================================
// GET - Obtener configuraciones por empresa
// ============================================

export const getConfiguracionesByEmpresa = async (
  empresaId: number
): Promise<ConfiguracionAlerta[]> => {
  const response = await apiClient.get<ConfiguracionAlerta[]>(`/alertas/configuracion/empresa/${empresaId}`);
  return response.data;
};

// ============================================
// POST - Crear configuración de alerta
// ============================================

export const createConfiguracion = async (
  data: Omit<ConfiguracionAlerta, "id" | "createdAt" | "updatedAt">
): Promise<ConfiguracionAlerta> => {
  const response = await apiClient.post<ConfiguracionAlerta>("/alertas/configuracion", data);
  return response.data;
};

// ============================================
// PUT - Actualizar configuración
// ============================================

export const updateConfiguracion = async (
  id: number,
  data: Partial<ConfiguracionAlerta>
): Promise<ConfiguracionAlerta> => {
  const response = await apiClient.put<ConfiguracionAlerta>(`/alertas/configuracion/${id}`, data);
  return response.data;
};

// ============================================
// PATCH - Habilitar/Deshabilitar alerta
// ============================================

export const toggleAlerta = async (id: number, habilitada: boolean): Promise<ConfiguracionAlerta> => {
  const response = await apiClient.patch<ConfiguracionAlerta>(`/alertas/configuracion/${id}/toggle`, {
    habilitada,
  });
  return response.data;
};

// ============================================
// GET - Obtener alertas activas
// ============================================

export const getAlertasActivas = async (empresaId: number): Promise<Alerta[]> => {
  const response = await apiClient.get<Alerta[]>(`/alertas/empresa/${empresaId}?resuelta=false`);
  return response.data;
};

// ============================================
// PATCH - Marcar alerta como resuelta
// ============================================

export const resolverAlerta = async (id: number, resolvidaPor: number): Promise<Alerta> => {
  const response = await apiClient.patch<Alerta>(`/alertas/${id}/resolver`, {
    resolvidaPor,
    resolvidaAt: new Date().toISOString(),
  });
  return response.data;
};

export default {
  getConfiguracionesByEmpresa,
  createConfiguracion,
  updateConfiguracion,
  toggleAlerta,
  getAlertasActivas,
  resolverAlerta,
};
