// ============================================
// Tipos para Reportes
// ============================================

export type TipoReporte =
  | "consumo-vehiculo"
  | "litros-surtidor"
  | "litros-operador"
  | "costos-centro-costo"
  | "analisis-desvios"
  | "ranking-eficiencia";

export interface ReporteFilter {
  empresaId?: number;
  fechaInicio?: string;
  fechaFin?: string;
  vehiculoId?: number;
  choferId?: number;
  surtidorId?: number;
  centroCostoId?: number;
}

// Reporte: Consumo por Vehículo
export interface ConsumoVehiculoData {
  vehiculoId: number;
  vehiculoPatente: string;
  vehiculoTipo: string;
  litrosTotales: number;
  kmRecorridos?: number; // Para transporte
  horasTrabajadas?: number; // Para maquinaria
  eficienciaKmPorLitro?: number; // L/100km
  eficienciaLitrosPorHora?: number; // L/hora
  costoTotal: number;
  numeroEventos: number;
}

// Reporte: Litros por Surtidor
export interface LitrosPorSurtidorData {
  surtidorId: number;
  surtidorNombre: string;
  litrosTotales: number;
  numeroEventos: number;
  costoTotal: number;
}

// Reporte: Litros por Operador
export interface LitrosPorOperadorData {
  choferId: number;
  choferNombre: string;
  choferApellido: string;
  litrosTotales: number;
  numeroEventos: number;
  vehiculosMasUsados: string[];
}

// Reporte: Costos por Centro de Costo
export interface CostoCentroCostoData {
  centroCostoId: number;
  centroCostoCodigo: string;
  centroCostoNombre: string;
  centroCostoTipo: string;
  litrosTotales: number;
  costoTotal: number;
  numeroEventos: number;
  vehiculosAsignados: number;
}

// Reporte: Análisis de Desvíos
export interface DesvioData {
  eventoId: number;
  fecha: string;
  vehiculoPatente: string;
  choferNombre: string;
  litros: number;
  tipoDesvio: "exceso" | "duplicado" | "ubicacion-invalida" | "horario-anomalo";
  descripcion: string;
  severidad: "alta" | "media" | "baja";
}

// Reporte: Ranking de Eficiencia
export interface RankingEficienciaData {
  vehiculoId: number;
  vehiculoPatente: string;
  vehiculoTipo: string;
  eficiencia: number; // km/L o L/hora según tipo
  posicion: number;
  litrosTotales: number;
  tendencia: "mejorando" | "estable" | "empeorando";
}

// ============================================
// Tipos para Evidencias
// ============================================

export type TipoEvidencia =
  | "foto-surtidor"
  | "foto-cuenta-litros"
  | "foto-odometro"
  | "foto-horometro"
  | "audio"
  | "ubicacion";

export interface Evidencia {
  id: number;
  eventoId: number;
  tipo: TipoEvidencia;
  url: string;
  filename?: string;
  mimeType?: string;
  size?: number;
  uploadedAt: string;
  metadata?: EvidenciaMetadata;
}

export interface EvidenciaMetadata {
  // Para imágenes
  width?: number;
  height?: number;
  
  // Para audio
  duration?: number;
  
  // Para ubicación
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

export interface EvidenciaUploadRequest {
  eventoId: number;
  tipo: TipoEvidencia;
  file: File;
  metadata?: Partial<EvidenciaMetadata>;
}

export interface EvidenciaUploadResponse {
  success: boolean;
  evidencia?: Evidencia;
  error?: string;
}

// ============================================
// Tipos para Políticas
// ============================================

export interface PoliticaCombustible {
  id: number;
  empresaId: number;
  evidenciasFotograficas: {
    surtidor: boolean;
    cuentaLitros: boolean;
    odometro: boolean;
    horometro: boolean;
  };
  evidenciaAudio: boolean;
  geolocalizacionObligatoria: boolean;
  litrosMaximosPorCarga: number;
  validarDuplicados: boolean;
  radioGeovallaMetros?: number;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Tipos para Precios de Combustible
// ============================================

export interface PrecioCombustible {
  id: number;
  empresaId: number;
  surtidorId?: number; // null = precio global
  precioLitro: number;
  moneda: string;
  fechaInicio: string;
  fechaFin?: string; // null = vigente
  activo: boolean;
  observaciones?: string;
  createdBy: number;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// Tipos para Umbrales por Vehículo
// ============================================

export interface UmbralVehiculo {
  id: number;
  vehiculoId: number;
  empresaId: number;
  consumoMaximoLitros?: number; // Por carga
  consumoPromedioEsperado?: number; // L/100km o L/hora
  toleranciaDesvio: number; // Porcentaje (ej: 15%)
  horasEntreCargas?: number; // Mínimo de horas
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Tipos para Alertas
// ============================================

export type TipoAlerta =
  | "exceso-litros"
  | "duplicado"
  | "ubicacion-invalida"
  | "horario-invalido"
  | "falta-evidencia"
  | "tanque-bajo"
  | "eficiencia-baja";

export type SeveridadAlerta = "alta" | "media" | "baja";

export interface Alerta {
  id: number;
  tipo: TipoAlerta;
  severidad: SeveridadAlerta;
  eventoId?: number;
  empresaId: number;
  descripcion: string;
  resuelta: boolean;
  resolvidaPor?: number;
  resolvidaAt?: string;
  createdAt: string;
}

export interface ConfiguracionAlerta {
  id: number;
  empresaId: number;
  tipoAlerta: TipoAlerta;
  severidad: SeveridadAlerta;
  habilitada: boolean;
  destinatarios: number[]; // IDs de usuarios
  condiciones: Record<string, unknown>; // JSON con condiciones específicas
  createdAt: string;
  updatedAt?: string;
}
