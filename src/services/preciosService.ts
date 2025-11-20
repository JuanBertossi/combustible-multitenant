import apiClient from "./api/apiClient";
import type {  PrecioCombustible } from "../types/reports";

/**
 * Servicio para gestionar precios de combustible
 */

// ============================================
// GET - Obtener precios por empresa
// ============================================

export const getPreciosByEmpresa = async (empresaId: number): Promise<PrecioCombustible[]> => {
  const response = await apiClient.get<PrecioCombustible[]>(`/precios/empresa/${empresaId}`);
  return response.data;
};

// ============================================
// GET - Obtener precio vigente
// ============================================

export const getPrecioVigente = async (
  empresaId: number,
  surtidorId?: number,
  fecha?: string
): Promise<PrecioCombustible | null> => {
  const params = new URLSearchParams();
  params.append("empresaId", empresaId.toString());
  if (surtidorId) params.append("surtidorId", surtidorId.toString());
  if (fecha) params.append("fecha", fecha);

  const response = await apiClient.get<PrecioCombustible>(`/precios/vigente?${params.toString()}`);
  return response.data;
};

// ============================================
// POST - Crear nuevo precio
// ============================================

export const createPrecio = async (
  data: Omit<PrecioCombustible, "id" | "createdAt" | "updatedAt">
): Promise<PrecioCombustible> => {
  const response = await apiClient.post<PrecioCombustible>("/precios", data);
  return response.data;
};

// ============================================
// PUT - Actualizar precio
// ============================================

export const updatePrecio = async (
  id: number,
  data: Partial<PrecioCombustible>
): Promise<PrecioCombustible> => {
  const response = await apiClient.put<PrecioCombustible>(`/precios/${id}`, data);
  return response.data;
};

// ============================================
// PATCH - Finalizar precio vigente
// ============================================

export const finalizarPrecio = async (id: number): Promise<PrecioCombustible> => {
  const response = await apiClient.patch<PrecioCombustible>(`/precios/${id}/finalizar`, {
    fechaFin: new Date().toISOString(),
  });
  return response.data;
};

export default {
  getPreciosByEmpresa,
  getPrecioVigente,
  createPrecio,
  updatePrecio,
  finalizarPrecio,
};
