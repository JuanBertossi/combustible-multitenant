// Roles del sistema
export const ROLES = {
    SUPER_ADMIN: 'SuperAdmin',
    ADMIN: 'Admin',
    SUPERVISOR: 'Supervisor',
    OPERADOR: 'Operador'
  };
  
  // Estados de eventos de combustible
  export const ESTADOS_EVENTO = {
    PENDIENTE: 'Pendiente',
    VALIDADO: 'Validado',
    RECHAZADO: 'Rechazado'
  };
  
  // Tipos de vehículos
  export const TIPOS_VEHICULO = [
    'Camión',
    'Tractor',
    'Sembradora',
    'Cosechadora',
    'Pulverizadora',
    'Pick-up',
    'Generador',
    'Otro'
  ];
  
  // Tipos de mercado
  export const TIPOS_MERCADO = ['Agro', 'Transporte'];
  
  // Colores para estados
  export const COLORES_ESTADO = {
    Pendiente: 'warning',
    Validado: 'success',
    Rechazado: 'error'
  };
  
  // API endpoints
  export const API_ENDPOINTS = {
    AUTH: '/auth',
    EMPRESAS: '/empresas',
    USUARIOS: '/usuarios',
    VEHICULOS: '/vehiculos',
    CHOFERES: '/choferes',
    EVENTOS: '/eventos',
    VALIDACION: '/validacion',
    REPORTES: '/reportes'
  };
  