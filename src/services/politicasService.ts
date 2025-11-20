import apiClient from "./api/apiClient";
import type { PoliticaCombustible } from "../types/reports";

/**
 * Servicio para gestionar políticas de combustible por empresa
 */

// ============================================
// GET - Obtener política por empresa
// ============================================

export const getPoliticaByEmpresa = async (empresaId: number): Promise<PoliticaCombustible> => {
  const response = await apiClient.get<PoliticaCombustible>(`/politicas/empresa/${empresaId}`);
  return response.data;
};

// ============================================
// PUT - Actualizar política
// ============================================

export const updatePolitica = async (
  id: number,
  data: Partial<PoliticaCombustible>
): Promise<PoliticaCombustible> => {
  const response = await apiClient.put<PoliticaCombustible>(`/politicas/${id}`, data);
  return response.data;
};

// ============================================
// POST - Crear política (primera vez)
// ============================================

export const createPolitica = async (
  data: Omit<PoliticaCombustible, "id" | "createdAt" | "updatedAt">
): Promise<PoliticaCombustible> => {
  const response = await apiClient.post<PoliticaCombustible>("/politicas", data);
  return response.data;
};

export default {
  getPoliticaByEmpresa,
  updatePolitica,
  createPolitica,
};
