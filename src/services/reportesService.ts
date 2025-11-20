import apiClient from "./api/apiClient";
import type {
  TipoReporte,
  ReporteFilter,
  ConsumoVehiculoData,
  LitrosPorSurtidorData,
  LitrosPorOperadorData,
  CostoCentroCostoData,
  DesvioData,
  RankingEficienciaData,
} from "../types/reports";

export const reportesService = {
  // Consumo por vehículo
  getConsumoVehiculo: async (
    filters: ReporteFilter
  ): Promise<ConsumoVehiculoData[]> => {
    const response = await apiClient.get<ConsumoVehiculoData[]>(
      "/reportes/consumo-vehiculo",
      { params: filters }
    );
    return response.data;
  },

  // Litros por surtidor
  getLitrosSurtidor: async (
    filters: ReporteFilter
  ): Promise<LitrosPorSurtidorData[]> => {
    const response = await apiClient.get<LitrosPorSurtidorData[]>(
      "/reportes/litros-surtidor",
      { params: filters }
    );
    return response.data;
  },

  // Litros por operador
  getLitrosOperador: async (
    filters: ReporteFilter
  ): Promise<LitrosPorOperadorData[]> => {
    const response = await apiClient.get<LitrosPorOperadorData[]>(
      "/reportes/litros-operador",
      { params: filters }
    );
    return response.data;
  },

  // Costos por centro de costo
  getCostosCentroCosto: async (
    filters: ReporteFilter
  ): Promise<CostoCentroCostoData[]> => {
    const response = await apiClient.get<CostoCentroCostoData[]>(
      "/reportes/costos-centro-costo",
      { params: filters }
    );
    return response.data;
  },

  // Análisis de desvíos
  getAnalisisDesvios: async (
    filters: ReporteFilter
  ): Promise<DesvioData[]> => {
    const response = await apiClient.get<DesvioData[]>(
      "/reportes/analisis-desvios",
      { params: filters }
    );
    return response.data;
  },

  // Ranking de eficiencia
  getRankingEficiencia: async (
    filters: ReporteFilter
  ): Promise<RankingEficienciaData[]> => {
    const response = await apiClient.get<RankingEficienciaData[]>(
      "/reportes/ranking-eficiencia",
      { params: filters }
    );
    return response.data;
  },

  // Método genérico para obtener cualquier tipo de reporte
  getReporte: async <T>(
    tipo: TipoReporte,
    filters: ReporteFilter
  ): Promise<T[]> => {
    const response = await apiClient.get<T[]>(`/reportes/${tipo}`, {
      params: filters,
    });
    return response.data;
  },

  // Exportar reporte a Excel
  exportToExcel: async (
    tipo: TipoReporte,
    filters: ReporteFilter
  ): Promise<Blob> => {
    const response = await apiClient.get(`/reportes/${tipo}/export/excel`, {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  },

  // Exportar reporte a PDF
  exportToPDF: async (
    tipo: TipoReporte,
    filters: ReporteFilter
  ): Promise<Blob> => {
    const response = await apiClient.get(`/reportes/${tipo}/export/pdf`, {
      params: filters,
      responseType: "blob",
    });
    return response.data;
  },
};
