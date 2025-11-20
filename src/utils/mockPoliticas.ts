import type {
  PoliticaCombustible,
  PrecioCombustible,
  UmbralVehiculo,
  ConfiguracionAlerta,
} from "../types/reports";

// ============================================
// Mock: Política de Combustible
// ============================================

export const mockPolitica: PoliticaCombustible = {
  id: 1,
  empresaId: 1,
  evidenciasFotograficas: {
    surtidor: true,
    cuentaLitros: true,
    odometro: true,
    horometro: false,
  },
  evidenciaAudio: true,
  geolocalizacionObligatoria: true,
  litrosMaximosPorCarga: 500,
  validarDuplicados: true,
  radioGeovallaMetros: 100,
  activo: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
};

// ============================================
// Mock: Precios de Combustible
// ============================================

export const mockPrecios: PrecioCombustible[] = [
  {
    id: 1,
    empresaId: 1,
    surtidorId: undefined, // Precio global
    precioLitro: 440,
    moneda: "ARS",
    fechaInicio: "2024-02-01T00:00:00Z",
    activo: true,
    observaciones: "Precio actualizado febrero 2024",
    createdBy: 1,
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: 2,
    empresaId: 1,
    surtidorId: undefined,
    precioLitro: 420,
    moneda: "ARS",
    fechaInicio: "2024-01-01T00:00:00Z",
    fechaFin: "2024-01-31T23:59:59Z",
    activo: false,
    observaciones: "Precio enero 2024",
    createdBy: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    empresaId: 1,
    surtidorId: 1, // Precio específico para SUR-001
    precioLitro: 435,
    moneda: "ARS",
    fechaInicio: "2024-02-01T00:00:00Z",
    activo: true,
    observaciones: "Precio con descuento surtidor principal",
    createdBy: 1,
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: 4,
    empresaId: 1,
    surtidorId: undefined,
    precioLitro: 400,
    moneda: "ARS",
    fechaInicio: "2023-12-01T00:00:00Z",
    fechaFin: "2023-12-31T23:59:59Z",
    activo: false,
    observaciones: "Precio diciembre 2023",
    createdBy: 1,
    createdAt: "2023-12-01T00:00:00Z",
  },
];

// ============================================
// Mock: Umbrales por Vehículo
// ============================================

export const mockUmbrales: UmbralVehiculo[] = [
  {
    id: 1,
    vehiculoId: 1, // AB123CD - Mercedes-Benz
    empresaId: 1,
    consumoMaximoLitros: 400,
    consumoPromedioEsperado: 33.8, // L/100km
    toleranciaDesvio: 15, // ±15%
    horasEntreCargas: 8,
    activo: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    vehiculoId: 2, // EF456GH - Scania
    empresaId: 1,
    consumoMaximoLitros: 450,
    consumoPromedioEsperado: 32.5, // L/100km
    toleranciaDesvio: 10, // ±10%
    horasEntreCargas: 6,
    activo: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    vehiculoId: 4, // MN012OP - John Deere
    empresaId: 1,
    consumoMaximoLitros: 500,
    consumoPromedioEsperado: 33.3, // L/hora
    toleranciaDesvio: 20, // ±20% (maquinaria agrícola más variable)
    activo: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    vehiculoId: 5, // QR345ST - Case IH
    empresaId: 1,
    consumoMaximoLitros: 480,
    consumoPromedioEsperado: 33.1, // L/hora
    toleranciaDesvio: 20, // ±20%
    activo: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// ============================================
// Mock: Configuraciones de Alertas
// ============================================

export const mockConfiguracionesAlertas: ConfiguracionAlerta[] = [
  {
    id: 1,
    empresaId: 1,
    tipoAlerta: "exceso-litros",
    severidad: "alta",
    habilitada: true,
    destinatarios: [1, 2], // IDs de Admin y Supervisor
    condiciones: {
      litrosExceso: 50,
      accionAutomatica: "rechazar",
    },
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    empresaId: 1,
    tipoAlerta: "duplicado",
    severidad: "alta",
    habilitada: true,
    destinatarios: [1],
    condiciones: {
      ventanaHoras: 2,
      toleranciaLitros: 5,
    },
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    empresaId: 1,
    tipoAlerta: "ubicacion-invalida",
    severidad: "media",
    habilitada: true,
    destinatarios: [1, 2],
    condiciones: {
      radioMetros: 100,
    },
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    empresaId: 1,
    tipoAlerta: "falta-evidencia",
    severidad: "media",
    habilitada: true,
    destinatarios: [2],
    condiciones: {
      tiposRequeridos: ["foto-surtidor", "foto-cuenta-litros"],
    },
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    empresaId: 1,
    tipoAlerta: "tanque-bajo",
    severidad: "baja",
    habilitada: true,
    destinatarios: [1, 3],
    condiciones: {
      nivelMinimoPorcentaje: 20,
    },
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 6,
    empresaId: 1,
    tipoAlerta: "eficiencia-baja",
    severidad: "baja",
    habilitada: false,
    destinatarios: [1],
    condiciones: {
      desvioEficienciaPorcentaje: 30,
    },
    createdAt: "2024-01-01T00:00:00Z",
  },
];
