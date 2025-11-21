import { useMemo } from "react";
import { useAuth } from "./useAuth";
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getRolePermissions,
  type Permission,
} from "../utils/permissions";

/**
 * Hook personalizado para verificar permisos del usuario actual
 * 
 * @example
 * const { can, canAll, canAny } = usePermissions();
 * 
 * if (can('eventos.crear')) {
 *   // Mostrar botón "Nuevo Evento"
 * }
 */
export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user?.rol) return [];
    return getRolePermissions(user.rol);
  }, [user?.rol]);

  const can = (permission: Permission): boolean => {
    if (!user?.rol) return false;
    return hasPermission(user.rol, permission);
  };

  const canAll = (requiredPermissions: Permission[]): boolean => {
    if (!user?.rol) return false;
    return hasAllPermissions(user.rol, requiredPermissions);
  };

  const canAny = (requiredPermissions: Permission[]): boolean => {
    if (!user?.rol) return false;
    return hasAnyPermission(user.rol, requiredPermissions);
  };

  return {
    /** Verifica si el usuario tiene un permiso específico */
    can,
    /** Verifica si el usuario tiene TODOS los permisos especificados */
    canAll,
    /** Verifica si el usuario tiene AL MENOS UNO de los permisos */
    canAny,
    /** Lista de todos los permisos del usuario */
    permissions,
    /** Rol del usuario actual */
    role: user?.rol,
  };
}
