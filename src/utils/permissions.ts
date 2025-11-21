import type { UserRole } from "../types";

/**
 * Definición de permisos del sistema
 * Cada permiso controla el acceso a una funcionalidad específica
 */
export const PERMISSIONS = {
  // Eventos
  EVENTOS_VER: "eventos.ver",
  EVENTOS_CREAR: "eventos.crear",
  EVENTOS_EDITAR: "eventos.editar",
  EVENTOS_ELIMINAR: "eventos.eliminar",
  EVENTOS_VALIDAR: "eventos.validar",

  // Dashboard
  DASHBOARD_VER: "dashboard.ver",
  DASHBOARD_ADMIN: "dashboard.admin",

  // Reportes
  REPORTES_VER: "reportes.ver",
  REPORTES_EXPORTAR: "reportes.exportar",
  REPORTES_AVANZADOS: "reportes.avanzados",

  // Configuración
  CONFIG_VER: "config.ver",
  CONFIG_EDITAR: "config.editar",
  CONFIG_POLITICAS: "config.politicas",
  CONFIG_PRECIOS: "config.precios",
  CONFIG_UMBRALES: "config.umbrales",

  // ABM (Alta, Baja, Modificación)
  ABM_VEHICULOS: "abm.vehiculos",
  ABM_USUARIOS: "abm.usuarios",
  ABM_SURTIDORES: "abm.surtidores",
  ABM_EMPRESAS: "abm.empresas",

  // Validación
  VALIDACION_VER: "validacion.ver",
  VALIDACION_APROBAR: "validacion.aprobar",
  VALIDACION_RECHAZAR: "validacion.rechazar",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Matriz de permisos por rol
 * Define qué permisos tiene cada rol del sistema
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Operador: Solo puede crear eventos y ver su propio dashboard
  Operador: [
    PERMISSIONS.EVENTOS_VER,
    PERMISSIONS.EVENTOS_CREAR,
    PERMISSIONS.DASHBOARD_VER,
  ],

  // Supervisor: Puede validar eventos, ver reportes y dashboard completo
  Supervisor: [
    PERMISSIONS.EVENTOS_VER,
    PERMISSIONS.EVENTOS_CREAR,
    PERMISSIONS.EVENTOS_EDITAR,
    PERMISSIONS.EVENTOS_VALIDAR,
    PERMISSIONS.DASHBOARD_VER,
    PERMISSIONS.DASHBOARD_ADMIN,
    PERMISSIONS.REPORTES_VER,
    PERMISSIONS.REPORTES_EXPORTAR,
    PERMISSIONS.VALIDACION_VER,
    PERMISSIONS.VALIDACION_APROBAR,
    PERMISSIONS.VALIDACION_RECHAZAR,
  ],

  // Auditor: Solo lectura en todo (reportes, configuración, validación)
  Auditor: [
    PERMISSIONS.EVENTOS_VER,
    PERMISSIONS.DASHBOARD_VER,
    PERMISSIONS.REPORTES_VER,
    PERMISSIONS.REPORTES_EXPORTAR,
    PERMISSIONS.REPORTES_AVANZADOS,
    PERMISSIONS.CONFIG_VER,
    PERMISSIONS.VALIDACION_VER,
  ],

  // Admin: Acceso completo a todo
  Admin: [
    PERMISSIONS.EVENTOS_VER,
    PERMISSIONS.EVENTOS_CREAR,
    PERMISSIONS.EVENTOS_EDITAR,
    PERMISSIONS.EVENTOS_ELIMINAR,
    PERMISSIONS.EVENTOS_VALIDAR,
    PERMISSIONS.DASHBOARD_VER,
    PERMISSIONS.DASHBOARD_ADMIN,
    PERMISSIONS.REPORTES_VER,
    PERMISSIONS.REPORTES_EXPORTAR,
    PERMISSIONS.REPORTES_AVANZADOS,
    PERMISSIONS.CONFIG_VER,
    PERMISSIONS.CONFIG_EDITAR,
    PERMISSIONS.CONFIG_POLITICAS,
    PERMISSIONS.CONFIG_PRECIOS,
    PERMISSIONS.CONFIG_UMBRALES,
    PERMISSIONS.ABM_VEHICULOS,
    PERMISSIONS.ABM_USUARIOS,
    PERMISSIONS.ABM_SURTIDORES,
    PERMISSIONS.VALIDACION_VER,
    PERMISSIONS.VALIDACION_APROBAR,
    PERMISSIONS.VALIDACION_RECHAZAR,
  ],

  // SuperAdmin: Acceso completo + gestión de empresas
  SuperAdmin: [
    ...Object.values(PERMISSIONS),
  ],
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return rolePermissions.includes(permission);
}

/**
 * Verifica si un rol tiene TODOS los permisos especificados
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Verifica si un rol tiene AL MENOS UNO de los permisos especificados
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Obtiene todos los permisos de un rol
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}
