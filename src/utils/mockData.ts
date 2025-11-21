// Datos hardcodeados para el MVP
import type { Evento, CentroCosto, Surtidor, Tanque } from "../types";
export const mockUser = {
  id: 1,
  nombre: "Juan",
  apellido: "Pérez",
  email: "admin@empresa.com",
  rol: "Admin",
  empresaId: 1,
  empresa: "AgroTransporte SA",
};

export const mockSurtidores: Surtidor[] = [
  {
    id: 1,
    codigo: "SUR-001",
    nombre: "Surtidor Principal",
    ubicacion: "Estación Central",
    tipoCombustible: "Diésel",
    empresaId: 1,
    empresa: "AgroTransporte SA",
    activo: true,
  },
  {
    id: 2,
    codigo: "SUR-002",
    nombre: "Surtidor Campo Norte",
    ubicacion: "Lote 45",
    tipoCombustible: "Diésel",
    empresaId: 1,
    empresa: "AgroTransporte SA",
    activo: true,
  },
  {
    id: 3,
    codigo: "SUR-003",
    nombre: "Surtidor Nave 3",
    ubicacion: "Planta Industrial",
    tipoCombustible: "Nafta",
    empresaId: 2,
    empresa: "Transportes del Sur",
    activo: false,
  },
];

// --- CORRIGE EL TIPO DE mockCentrosCosto ---
export const mockCentrosCosto: CentroCosto[] = [
  {
    id: 1,
    codigo: "LOTE-05B",
    nombre: "Lote 5B - Maíz",
    tipo: "Lote",
    activo: true,
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 2,
    codigo: "OBRA-RP9",
    nombre: "Obra Ruta Provincial 9",
    tipo: "Obra",
    activo: true,
    empresaId: 2,
    empresaNombre: "Logística del Sur",
  },
  {
    id: 3,
    codigo: "AREA-MANT",
    nombre: "Mantenimiento General",
    tipo: "Area",
    activo: true,
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 4,
    codigo: "PROY-AQUA",
    nombre: "Proyecto Aqua",
    tipo: "Proyecto",
    activo: false,
    empresaId: 2,
    empresaNombre: "Logística del Sur",
  },
];

export const mockSuperAdmin = {
  id: 999,
  nombre: "System",
  apellido: "Administrator",
  email: "superadmin@fuelsystem.com",
  rol: "SuperAdmin",
  empresaId: null,
  empresa: "Fuel Management Platform",
};

export const mockEmpresas = [
  {
    id: 1,
    nombre: "AgroTransporte SA",
    cuit: "30-12345678-9",
    tipoMercado: "Agro" as const,
    activo: true,
    // Personalización Multi-Tenant
    logo: "/logos/agrotransporte.png",
    colorPrimario: "#1E2C56",
    colorSecundario: "#10b981",
  },
  {
    id: 2,
    nombre: "Logística del Sur",
    cuit: "30-87654321-0",
    tipoMercado: "Transporte" as const,
    activo: true,
    // Personalización Multi-Tenant
    logo: "/logos/logistica-sur.png",
    colorPrimario: "#3b82f6",
    colorSecundario: "#f59e0b",
  },
  {
    id: 3,
    nombre: "Campo Verde SRL",
    cuit: "30-11223344-5",
    tipoMercado: "Agro" as const,
    activo: false,
    // Personalización Multi-Tenant
    logo: "/logos/campo-verde.png",
    colorPrimario: "#059669",
    colorSecundario: "#84cc16",
  },
];

export const mockUsuarios = [
  {
    id: 1,
    empresaId: 1,
    empresa: "AgroTransporte SA",
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan@empresa.com",
    whatsapp: "+5493512345678",
    rol: "Admin",
    activo: true,
  },
  {
    id: 2,
    empresaId: 1,
    empresa: "AgroTransporte SA",
    nombre: "María",
    apellido: "González",
    email: "maria@empresa.com",
    whatsapp: "+5493518765432",
    rol: "Supervisor",
    activo: true,
  },
  {
    id: 3,
    empresaId: 1,
    empresa: "AgroTransporte SA",
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "carlos@empresa.com",
    whatsapp: "+5493519876543",
    rol: "Operador",
    activo: true,
  },
  {
    id: 4,
    empresaId: 2,
    empresa: "Logística del Sur",
    nombre: "Ana",
    apellido: "Martínez",
    email: "ana@logistica.com",
    whatsapp: "+5493513456789",
    rol: "Admin",
    activo: true,
  },
  {
    id: 5,
    empresaId: 2,
    empresa: "Logística del Sur",
    nombre: "Pedro",
    apellido: "López",
    email: "pedro@logistica.com",
    whatsapp: "+5493514567890",
    rol: "Operador",
    activo: true,
  },
];

export const mockVehiculos = [
  {
    id: 1,
    empresaId: 1,
    empresa: "AgroTransporte SA",
    patente: "ABC123",
    tipo: "Camión",
    marca: "Mercedes Benz",
    modelo: "Atego 1726",
    anio: 2020,
    capacidad: 300,
    capacidadTanque: 300, // Litros - capacidad del tanque de combustible
    activo: true,
  },
  {
    id: 2,
    empresaId: 1,
    empresa: "AgroTransporte SA",
    patente: "DEF456",
    tipo: "Tractor",
    marca: "John Deere",
    modelo: "6110J",
    anio: 2019,
    capacidad: 250,
    capacidadTanque: 250, // Litros
    activo: true,
  },
  {
    id: 3,
    empresaId: 2,
    empresa: "Logística del Sur",
    patente: "GHI789",
    tipo: "Camión",
    marca: "Scania",
    modelo: "R450",
    anio: 2021,
    capacidad: 400,
    capacidadTanque: 400, // Litros
    activo: true,
  },
  {
    id: 4,
    empresaId: 1,
    empresa: "AgroTransporte SA",
    patente: "JKL012",
    tipo: "Sembradora",
    marca: "Apache",
    modelo: "27000",
    anio: 2018,
    capacidad: 180,
    capacidadTanque: 180, // Litros
    activo: true,
  },
  {
    id: 5,
    empresaId: 2,
    empresa: "Logística del Sur",
    patente: "MNO345",
    tipo: "Camión",
    marca: "Iveco",
    modelo: "Tector",
    anio: 2017,
    capacidad: 280,
    capacidadTanque: 280, // Litros
    activo: false,
  },
];

export const mockChoferes = [
  {
    id: 1,
    empresaId: 1,
    empresa: "AgroTransporte SA",
    nombre: "Roberto",
    apellido: "Sánchez",
    dni: "25123456",
    licencia: "B1234567",
    whatsapp: "+5493511234567",
    activo: true,
  },
  {
    id: 2,
    empresaId: 1,
    empresa: "AgroTransporte SA",
    nombre: "Diego",
    apellido: "Fernández",
    dni: "28765432",
    licencia: "B7654321",
    whatsapp: "+5493517654321",
    activo: true,
  },
  {
    id: 3,
    empresaId: 2,
    empresa: "Logística del Sur",
    nombre: "Luis",
    apellido: "Gómez",
    dni: "30987654",
    licencia: "B9876543",
    whatsapp: "+5493519876543",
    activo: true,
  },
  {
    id: 4,
    empresaId: 2,
    empresa: "Logística del Sur",
    nombre: "Pedro",
    apellido: "López",
    dni: "27456789",
    licencia: "B4567890",
    whatsapp: "+5493514567890",
    activo: false,
  },
];

export const mockEventos: Evento[] = [
  {
    id: 1,
    fecha: "2023-02-02T08:00:00Z", //
    vehiculoId: 2, // Asignado desde mockVehiculos
    vehiculoPatente: "PICK UP", //
    choferId: 1, // Asignado desde mockChoferes
    choferNombre: "Roberto Sánchez",
    litros: 55, //
    precio: 950.0,
    total: 52250,
    surtidorId: 1, // Asignado desde mockSurtidores
    surtidorNombre: "Surtidor Principal",
    observaciones: "Carga inicial de planilla",
    estado: "Validado",
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 2,
    fecha: "2023-02-03T09:30:00Z", //
    vehiculoId: 2, // Asignado desde mockVehiculos (Tractor)
    vehiculoPatente: "PAUNY NUEVO", //
    choferId: 2, // Asignado desde mockChoferes
    choferNombre: "Diego Fernández",
    litros: 127, //
    precio: 950.0,
    total: 120650,
    surtidorId: 1,
    surtidorNombre: "Surtidor Principal",
    observaciones: "",
    estado: "Pendiente", // Ideal para probar la pantalla de validación
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 3,
    fecha: "2023-02-06T11:00:00Z", //
    vehiculoId: 4, // Asignado desde mockVehiculos (Sembradora)
    vehiculoPatente: "METALFOR", //
    choferId: 1,
    choferNombre: "Roberto Sánchez",
    litros: 104, //
    precio: 950.0,
    total: 98800,
    surtidorId: 2, // Asignado desde mockSurtidores
    surtidorNombre: "Surtidor Campo Norte",
    observaciones: "Carga en Lote 45",
    estado: "Validado",
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 4,
    fecha: "2023-02-08T15:00:00Z", //
    vehiculoId: 1, // Asignado desde mockVehiculos (Camión)
    vehiculoPatente: "AUTOELEVADOR FORTIA", //
    choferId: 2,
    choferNombre: "Diego Fernández",
    litros: 50, //
    precio: 950.0,
    total: 47500,
    surtidorId: 1,
    surtidorNombre: "Surtidor Principal",
    observaciones: "",
    estado: "Validado",
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 5,
    fecha: "2023-02-09T08:15:00Z", //
    vehiculoId: 4,
    vehiculoPatente: "METALFOR", //
    choferId: 1,
    choferNombre: "Roberto Sánchez",
    litros: 155, //
    precio: 955.0, // Precio diferente
    total: 148025,
    surtidorId: 2,
    surtidorNombre: "Surtidor Campo Norte",
    observaciones: "",
    estado: "Validado",
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 6,
    fecha: "2023-02-13T10:00:00Z", //
    vehiculoId: 2,
    vehiculoPatente: "NEW HOLLAND", //
    choferId: 2,
    choferNombre: "Diego Fernández",
    litros: 141, //
    precio: 955.0,
    total: 134655,
    surtidorId: 2,
    surtidorNombre: "Surtidor Campo Norte",
    observaciones: "",
    estado: "Validado",
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 7,
    fecha: "2023-02-15T16:30:00Z", //
    vehiculoId: 1,
    vehiculoPatente: "FORTIA", //
    choferId: 1,
    choferNombre: "Roberto Sánchez",
    litros: 47, //
    precio: 955.0,
    total: 44885,
    surtidorId: 1,
    surtidorNombre: "Surtidor Principal",
    observaciones: "",
    estado: "Rechazado", // Para probar el filtro de rechazados
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 8,
    fecha: "2023-02-17T09:00:00Z", //
    vehiculoId: 2,
    vehiculoPatente: "PAUNY NUEVO", //
    choferId: 2,
    choferNombre: "Diego Fernández",
    litros: 150, //
    precio: 955.0,
    total: 143250,
    surtidorId: 1,
    surtidorNombre: "Surtidor Principal",
    observaciones: "",
    estado: "Pendiente", // Otro pendiente
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 9,
    fecha: "2023-02-23T14:00:00Z", //
    vehiculoId: 2, // Asumimos PICK UP es vehiculoId 2
    vehiculoPatente: "PICK UP", //
    choferId: 1,
    choferNombre: "Roberto Sánchez",
    litros: 71, //
    precio: 960.0,
    total: 68160,
    surtidorId: 1,
    surtidorNombre: "Surtidor Principal",
    observaciones: "",
    estado: "Validado",
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 10,
    fecha: "2023-02-23T14:05:00Z", //
    vehiculoId: 4,
    vehiculoPatente: "METALFOR", //
    choferId: 2,
    choferNombre: "Diego Fernández",
    litros: 133, //
    precio: 960.0,
    total: 127680,
    surtidorId: 2,
    surtidorNombre: "Surtidor Campo Norte",
    observaciones: "Carga consecutiva",
    estado: "Validado",
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 11,
    fecha: "2023-02-24T18:00:00Z", //
    vehiculoId: 1, // Asumimos GENERADOR es vehiculoId 1 (Camión?)
    vehiculoPatente: "GENERADOR", //
    choferId: 1,
    choferNombre: "Roberto Sánchez",
    litros: 111, //
    precio: 960.0,
    total: 106560,
    surtidorId: 1,
    surtidorNombre: "Surtidor Principal",
    observaciones: "Generador planta",
    estado: "Validado",
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
  {
    id: 12,
    fecha: "2023-02-27T18:30:00Z", //
    vehiculoId: 1,
    vehiculoPatente: "GENERADOR", //
    choferId: 1,
    choferNombre: "Roberto Sánchez",
    litros: 104, //
    precio: 960.0,
    total: 99840,
    surtidorId: 1,
    surtidorNombre: "Surtidor Principal",
    observaciones: "",
    estado: "Validado",
    empresaId: 1,
    empresaNombre: "AgroTransporte SA",
  },
];

export const dashboardKPIs = {
  consumoMensual: { litros: 8450, costo: 5070000, variacion: 12.5 },
  eventosPendientes: 3,
  vehiculosActivos: 18,
  eficiencia: { promedio: 28.5, status: "good" },
};

export const consumoPorVehiculo = [
  { vehiculo: "ABC123", litros: 1250 },
  { vehiculo: "GHI789", litros: 1180 },
  { vehiculo: "DEF456", litros: 980 },
  { vehiculo: "JKL012", litros: 850 },
  { vehiculo: "MNO345", litros: 720 },
];

export const consumoTemporal = [
  { fecha: "22/10", litros: 450 },
  { fecha: "23/10", litros: 520 },
  { fecha: "24/10", litros: 380 },
  { fecha: "25/10", litros: 610 },
  { fecha: "26/10", litros: 490 },
  { fecha: "27/10", litros: 550 },
  { fecha: "28/10", litros: 420 },
];

// ============================================
// Mock Data para Tanques
// ============================================

export const mockTanques = [
  {
    id: 1,
    codigo: "TNQ-001",
    nombre: "Tanque Diesel 10000L",
    tipoCombustible: "Diesel" as const,
    capacidadTotal: 10000,
    nivelActual: 7500,
    nivelMinimo: 2000,
    ubicacion: "Depósito Principal",
    empresaId: 1,
    empresaNombre: "Empresa Demo",
    activo: true,
    ultimaRecarga: "2025-01-15T10:30:00",
  },
  {
    id: 2,
    codigo: "TNQ-002",
    nombre: "Tanque Nafta 5000L",
    tipoCombustible: "Nafta" as const,
    capacidadTotal: 5000,
    nivelActual: 1800,
    nivelMinimo: 1000,
    ubicacion: "Depósito Principal",
    empresaId: 1,
    empresaNombre: "Empresa Demo",
    activo: true,
    ultimaRecarga: "2025-01-16T14:20:00",
  },
  {
    id: 3,
    codigo: "TNQ-003",
    nombre: "Tanque GNC 3000L",
    tipoCombustible: "GNC" as const,
    capacidadTotal: 3000,
    nivelActual: 2800,
    nivelMinimo: 500,
    ubicacion: "Playa de Carga",
    empresaId: 1,
    empresaNombre: "Empresa Demo",
    activo: true,
    ultimaRecarga: "2025-01-14T09:15:00",
  },
];

// ============================================
// Mock Data para Surtidores (Actualizado)
// ============================================

export const mockSurtidoresNew = [
  {
    id: 1,
    codigo: "SURT-001",
    nombre: "Surtidor Principal Diesel",
    ubicacion: "Playa de carga - Sector A",
    tipoCombustible: "Diesel" as const,
    tanqueId: 1,
    tanqueNombre: "Tanque Diesel 10000L",
    empresaId: 1,
    empresaNombre: "Empresa Demo",
    activo: true,
    lecturaActual: 125430,
  },
  {
    id: 2,
    codigo: "SURT-002",
    nombre: "Surtidor Nafta Premium",
    ubicacion: "Playa de carga - Sector B",
    tipoCombustible: "Nafta" as const,
    tanqueId: 2,
    tanqueNombre: "Tanque Nafta 5000L",
    empresaId: 1,
    empresaNombre: "Empresa Demo",
    activo: true,
    lecturaActual: 89250,
  },
  {
    id: 3,
    codigo: "SURT-003",
    nombre: "Surtidor GNC",
    ubicacion: "Playa de carga - Sector C",
    tipoCombustible: "GNC" as const,
    tanqueId: 3,
    tanqueNombre: "Tanque GNC 3000L",
    empresaId: 1,
    empresaNombre: "Empresa Demo",
    activo: false,
    lecturaActual: 45680,
  },
];

