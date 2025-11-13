import type {
  UserRole,
  EstadoEvento,
  TipoVehiculo,
  TipoMercado,
} from "../types";

// Roles del sistema
export const ROLES: Record<string, UserRole> = {
  SUPER_ADMIN: "SuperAdmin",
  ADMIN: "Admin",
  SUPERVISOR: "Supervisor",
  OPERADOR: "Operador",
} as const;

// Estados de eventos de combustible
export const ESTADOS_EVENTO: Record<string, EstadoEvento> = {
  PENDIENTE: "Pendiente",
  VALIDADO: "Validado",
  RECHAZADO: "Rechazado",
} as const;

// Tipos de vehículos
export const TIPOS_VEHICULO: readonly TipoVehiculo[] = [
  "Camión",
  "Tractor",
  "Sembradora",
  "Cosechadora",
  "Pulverizadora",
  "Pick-up",
  "Generador",
  "Otro",
] as const;

// Tipos de mercado
export const TIPOS_MERCADO: readonly TipoMercado[] = [
  "Agro",
  "Transporte",
] as const;

// Colores para estados
export const COLORES_ESTADO: Record<
  EstadoEvento,
  "warning" | "success" | "error"
> = {
  Pendiente: "warning",
  Validado: "success",
  Rechazado: "error",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: "/auth",
  EMPRESAS: "/empresas",
  USUARIOS: "/usuarios",
  VEHICULOS: "/vehiculos",
  CHOFERES: "/choferes",
  EVENTOS: "/eventos",
  VALIDACION: "/validacion",
  REPORTES: "/reportes",
} as const;
