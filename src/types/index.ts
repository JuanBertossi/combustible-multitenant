// ============================================
// Tipos de Autenticación y Usuario
// ============================================

export type UserRole = "SuperAdmin" | "Admin" | "Supervisor" | "Operador";

export interface User {
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  rol: UserRole;
  empresaId?: number;
  empresaNombre?: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  nombre: string;
  apellido?: string;
  email: string;
  rol: UserRole;
  empresaId?: number;
  empresaNombre?: string;
}

// ============================================
// Tipos de Empresa
// ============================================

export type TipoMercado = "Agro" | "Transporte";

export interface Empresa {
  id: number;
  nombre: string;
  cuit?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  tipoMercado: TipoMercado;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Tipos de Vehículo
// ============================================

export type TipoVehiculo =
  | "Camión"
  | "Tractor"
  | "Sembradora"
  | "Cosechadora"
  | "Pulverizadora"
  | "Pick-up"
  | "Generador"
  | "Otro";

export interface Vehiculo {
  id: number;
  patente: string;
  marca?: string;
  modelo?: string;
  anio?: number;
  tipo: TipoVehiculo;
  activo: boolean;
  empresaId: number;
  empresaNombre?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Tipos de Chofer
// ============================================

export interface Chofer {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono?: string;
  email?: string;
  activo: boolean;
  empresaId: number;
  empresaNombre?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Tipos de Evento
// ============================================

export type EstadoEvento = "Pendiente" | "Validado" | "Rechazado";

export interface Evento {
  id: number;
  fecha: string;
  vehiculoId: number;
  vehiculoPatente?: string;
  choferId: number;
  choferNombre?: string;
  litros: number;
  precio?: number;
  total?: number;
  surtidorId?: number;
  surtidorNombre?: string;
  observaciones?: string;
  estado: EstadoEvento;
  empresaId: number;
  empresaNombre?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Tipos de Surtidor
// ============================================

export interface Surtidor {
  id: number;
  nombre: string;
  ubicacion?: string;
  activo: boolean;
  empresaId: number;
  empresaNombre?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SurtidorExtended extends Surtidor {
  codigo?: string;
  tipoCombustible?: string;
  empresa?: string;
}

// ============================================
// Tipos de Tanque
// ============================================

export interface Tanque {
  id: number;
  nombre: string;
  capacidadMaxima: number;
  nivelActual: number;
  ubicacion?: string;
  activo: boolean;
  empresaId: number;
  empresaNombre?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Tipos de Centro de Costo
// ============================================

export type TipoCentroCosto = "Lote" | "Obra" | "Area" | "Proyecto" | "Otro";

export interface CentroCosto {
  id: number;
  codigo: string;
  nombre: string;
  tipo: TipoCentroCosto;
  activo: boolean;
  empresaId: number;
  empresaNombre?: string;
}
// ============================================
// Tipos de Usuario del Sistema
// ============================================
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: UserRole;
  activo: boolean;
  empresaId?: number;
  empresaNombre?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// Tipos para API y respuestas
// ============================================

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Tipos para Dashboard y KPIs
// ============================================

export interface KPIData {
  label: string;
  value: number | string;
  trend?: number;
  icon?: React.ReactNode;
  color?: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

// ============================================
// Tipos de Props comunes
// ============================================

export interface TableColumn<T> {
  id: keyof T | string;
  label: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
  format?: (value: T[keyof T], row: T) => React.ReactNode;
}

// ============================================
// Tipos para Formularios
// ============================================

export interface FormErrors {
  [key: string]: string;
}

export interface DialogState {
  open: boolean;
  mode: "create" | "edit";
  selectedId?: number | null;
}

export interface FormHandlers {
  handleInputChange: (field: string, value: string | number | boolean) => void;
  handleSubmit: (e: React.FormEvent) => void | Promise<void>;
  handleCancel: () => void;
}

// ============================================
// Tipos para Filtros de Eventos
// ============================================

export interface EventoFilters {
  empresaId?: number | null;
  fechaInicio?: string;
  fechaFin?: string;
  vehiculoId?: number | null;
  choferId?: number | null;
  estado?: EstadoEvento | null;
}
