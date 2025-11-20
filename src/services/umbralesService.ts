import apiClient from "./api/apiClient";
import type { UmbralVehiculo } from "../types/reports";

/**
 * Servicio para gestionar umbrales de consumo por vehículo
 */

// ============================================
// GET - Obtener umbrales por empresa
// ============================================

export const getUmbralesByEmpresa = async (empresaId: number): Promise<UmbralVehiculo[]> => {
  const response = await apiClient.get<UmbralVehiculo[]>(`/umbrales/empresa/${empresaId}`);
  return response.data;
};

// ============================================
// GET - Obtener umbral por vehículo
// ============================================

export const getUmbralByVehiculo = async (vehiculoId: number): Promise<UmbralVehiculo | null> => {
  const response = await apiClient.get<UmbralVehiculo>(`/umbrales/vehiculo/${vehiculoId}`);
  return response.data;
};

// ============================================
// POST - Crear nuevo umbral
// ============================================

export const createUmbral = async (
  data: Omit<UmbralVehiculo, "id" | "createdAt" | "updatedAt">
): Promise<UmbralVehiculo> => {
  const response = await apiClient.post<UmbralVehiculo>("/umbrales", data);
  return response.data;
};

// ============================================
// PUT - Actualizar umbral
// ============================================

export const updateUmbral = async (
  id: number,
  data: Partial<UmbralVehiculo>
): Promise<UmbralVehiculo> => {
  const response = await apiClient.put<UmbralVehiculo>(`/umbrales/${id}`, data);
  return response.data;
};

// ============================================
// DELETE - Eliminar umbral
// ============================================

export const deleteUmbral = async (id: number): Promise<void> => {
  await apiClient.delete(`/umbrales/${id}`);
};

export default {
  getUmbralesByEmpresa,
  getUmbralByVehiculo,
  createUmbral,
  updateUmbral,
  deleteUmbral,
};
