// import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
// import { useAuth } from "../hooks/useAuth";
// import { mockEmpresas } from "../utils/mockData";
// import type { Tenant } from "../types";

// interface TenantContextType {
//   currentTenant: Tenant | null;
//   tenants: Tenant[];
//   isLoading: boolean;
//   switchTenant: (tenantId: number) => Promise<void>;
//   refreshTenant: () => Promise<void>;
// }

// const TenantContext = createContext<TenantContextType | undefined>(undefined);

// // Exportar el context para que useTenant.ts pueda usarlo
// export { TenantContext };

// interface TenantProviderProps {
//   children: ReactNode;
// }

// export function TenantProvider({ children }: TenantProviderProps) {
//   const { user } = useAuth();
//   const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
//   const [tenants, setTenants] = useState<Tenant[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Inicializar tenant cuando el usuario cambia
//   const initializeTenant = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       // Simular delay de API
//       await new Promise((resolve) => setTimeout(resolve, 300));

//       if (user?.rol === "SuperAdmin") {
//         // SuperAdmin puede ver todas las empresas activas
//         const activeTenants = mockEmpresas.filter((e) => e.activo);
//         setTenants(activeTenants);

//         // Intentar cargar tenant guardado en localStorage
//         const savedTenantId = localStorage.getItem("currentTenantId");
//         if (savedTenantId) {
//           const savedTenant = activeTenants.find((t) => t.id === Number(savedTenantId));
//           if (savedTenant) {
//             setCurrentTenant(savedTenant);
//             applyTenantTheme(savedTenant);
//             return;
//           }
//         }

//         // Si no hay tenant guardado, seleccionar el primero
//         if (activeTenants.length > 0 && activeTenants[0]) {
//           setCurrentTenant(activeTenants[0]);
//           applyTenantTheme(activeTenants[0]);
//           localStorage.setItem("currentTenantId", activeTenants[0].id.toString());
//         }
//       } else {
//         // Otros roles solo ven su propia empresa
//         const userTenant = mockEmpresas.find((e) => e.id === user?.empresaId);
//         if (userTenant) {
//           setCurrentTenant(userTenant);
//           setTenants([userTenant]);
//           applyTenantTheme(userTenant);
//           localStorage.setItem("currentTenantId", userTenant.id.toString());
//         }
//       }
//     } catch (error) {
//       console.error("Error initializing tenant:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user]);

//   // Ejecutar inicialización cuando cambia el usuario
//   useEffect(() => {
//     if (user) {
//       initializeTenant();
//     } else {
//       setCurrentTenant(null);
//       setTenants([]);
//       setIsLoading(false);
//     }
//   }, [user, initializeTenant]);

//   const switchTenant = async (tenantId: number) => {
//     // Solo SuperAdmin puede cambiar de tenant
//     if (user?.rol !== "SuperAdmin") {
//       console.warn("Only SuperAdmin can switch tenants");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Simular delay de API
//       await new Promise((resolve) => setTimeout(resolve, 200));

//       const newTenant = tenants.find((t) => t.id === tenantId);
//       if (newTenant) {
//         setCurrentTenant(newTenant);
//         applyTenantTheme(newTenant);
//         localStorage.setItem("currentTenantId", tenantId.toString());
//       }
//     } catch (error) {
//       console.error("Error switching tenant:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const refreshTenant = async () => {
//     setIsLoading(true);
//     try {
//       // Simular recarga de configuración del tenant desde API
//       await new Promise((resolve) => setTimeout(resolve, 200));

//       if (currentTenant) {
//         const updatedTenant = mockEmpresas.find((e) => e.id === currentTenant.id);
//         if (updatedTenant) {
//           setCurrentTenant(updatedTenant);
//           applyTenantTheme(updatedTenant);
//         }
//       }
//     } catch (error) {
//       console.error("Error refreshing tenant:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const applyTenantTheme = (tenant: Tenant) => {
//     // Aplicar colores del tenant como CSS variables
//     if (tenant.colorPrimario) {
//       document.documentElement.style.setProperty("--tenant-primary", tenant.colorPrimario);
//     }
//     if (tenant.colorSecundario) {
//       document.documentElement.style.setProperty("--tenant-secondary", tenant.colorSecundario);
//     }
//   };

//   const value: TenantContextType = {
//     currentTenant,
//     tenants,
//     isLoading,
//     switchTenant,
//     refreshTenant,
//   };

//   return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
// }

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { mockEmpresas } from "../utils/mockData";
import { useTenantDomain } from "@/hooks/use-tenant-domain"; // ✅ Importamos el hook nuevo
import type { Tenant } from "../types";

interface TenantContextType {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  isLoading: boolean;
  switchTenant: (tenantId: number) => Promise<void>;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export { TenantContext };

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { user } = useAuth();
  const domainTenant = useTenantDomain(); // ✅ Obtenemos el subdominio (ej: 'agro', 'default')

  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializeTenant = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 1. Cargar empresas disponibles (en producción vendría de API)
      const activeTenants = mockEmpresas.filter((e) => e.activo);
      setTenants(activeTenants);

      let tenantFound: Tenant | undefined;

      // ---------------------------------------------------------
      // 🔍 ESTRATEGIA 1: BÚSQUEDA POR SUBDOMINIO (Prioridad Alta)
      // ---------------------------------------------------------
      if (domainTenant && domainTenant !== "default") {
        // Normalizamos el nombre para comparar (ej: "AgroTransporte SA" -> coincide con "agro")
        // Esto permite que 'agro.tuapp.com' cargue 'AgroTransporte SA'
        tenantFound = activeTenants.find((t) =>
          t.nombre
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .includes(domainTenant.toLowerCase())
        );

        if (tenantFound) {
          console.log(
            `✅ Tenant detectado por dominio (${domainTenant}):`,
            tenantFound.nombre
          );
        }
      }

      // ---------------------------------------------------------
      // 👤 ESTRATEGIA 2: BÚSQUEDA POR USUARIO (Fallback)
      // ---------------------------------------------------------
      // Si no hay subdominio (estás en localhost o dominio raíz) o no se encontró:
      if (!tenantFound) {
        if (user?.rol !== "SuperAdmin") {
          // Usuario normal: Solo puede ver su propia empresa asignada
          tenantFound = activeTenants.find((e) => e.id === user?.empresaId);
        } else {
          // SuperAdmin: Intentar recuperar la última selección del localStorage
          const savedId = localStorage.getItem("currentTenantId");
          if (savedId) {
            tenantFound = activeTenants.find((t) => t.id === Number(savedId));
          }
          // Si no hay guardado, usar el primero disponible
          if (!tenantFound && activeTenants.length > 0) {
            tenantFound = activeTenants[0];
          }
        }
      }

      // ---------------------------------------------------------
      // 💾 ESTABLECER ESTADO FINAL
      // ---------------------------------------------------------
      if (tenantFound) {
        setCurrentTenant(tenantFound);
        applyTenantTheme(tenantFound);

        // Guardamos en localStorage para persistencia si es navegación manual
        if (
          user?.rol === "SuperAdmin" ||
          !domainTenant ||
          domainTenant === "default"
        ) {
          localStorage.setItem("currentTenantId", tenantFound.id.toString());
        }
      }
    } catch (error) {
      console.error("Error initializing tenant:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, domainTenant]); // Se re-ejecuta si cambia el usuario o el subdominio

  useEffect(() => {
    initializeTenant();
  }, [initializeTenant]);

  // ... Mantener switchTenant, refreshTenant y applyTenantTheme iguales ...
  const switchTenant = async (tenantId: number) => {
    if (user?.rol !== "SuperAdmin") return;
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const newTenant = tenants.find((t) => t.id === tenantId);
      if (newTenant) {
        setCurrentTenant(newTenant);
        applyTenantTheme(newTenant);
        localStorage.setItem("currentTenantId", tenantId.toString());
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTenant = async () => {
    await initializeTenant();
  };

  const applyTenantTheme = (tenant: Tenant) => {
    if (tenant.colorPrimario)
      document.documentElement.style.setProperty(
        "--tenant-primary",
        tenant.colorPrimario
      );
    if (tenant.colorSecundario)
      document.documentElement.style.setProperty(
        "--tenant-secondary",
        tenant.colorSecundario
      );
  };

  const value: TenantContextType = {
    currentTenant,
    tenants,
    isLoading,
    switchTenant,
    refreshTenant,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}
