import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth"; // Asegúrate que la ruta sea correcta
import { mockEmpresas } from "@/utils/mockData"; // Tus datos de empresas
import { useTenantDomain } from "@/hooks/use-tenant-domain"; // El hook del template
import { TenantContext } from "@/context/TenantContext"; // Usamos la definición de contexto existente
import type { Tenant } from "@/types";

interface TenantProviderProps {
  children: React.ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { user } = useAuth();
  const domainTenant = useTenantDomain(); // Obtenemos 'default' o el nombre del subdominio (ej: 'agro')

  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initializeTenant = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 300));

      const activeTenants = mockEmpresas.filter((e) => e.activo);
      setTenants(activeTenants);

      let tenantFound: Tenant | undefined;

      // ---------------------------------------------------------
      // 1. ESTRATEGIA DE SUBDOMINIO (Prioridad Alta)
      // ---------------------------------------------------------
      if (domainTenant && domainTenant !== "default") {
        // Buscamos una empresa cuyo nombre (limpio de espacios) coincida con el subdominio
        // Ej: subdominio "agro" coincidirá con "AgroTransporte SA"
        tenantFound = activeTenants.find((t) =>
          t.nombre
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")
            .includes(domainTenant.toLowerCase())
        );
      }

      // ---------------------------------------------------------
      // 2. ESTRATEGIA DE USUARIO (Fallback / Localhost)
      // ---------------------------------------------------------
      if (!tenantFound) {
        if (user?.rol !== "SuperAdmin") {
          // Usuario normal: Solo ve su empresa asignada
          tenantFound = activeTenants.find((e) => e.id === user?.empresaId);
        } else {
          // SuperAdmin: Intenta recuperar la última selección o usa la primera
          const savedId = localStorage.getItem("currentTenantId");
          if (savedId)
            tenantFound = activeTenants.find((t) => t.id === Number(savedId));
          if (!tenantFound) tenantFound = activeTenants[0];
        }
      }

      // Establecer el tenant activo
      if (tenantFound) {
        setCurrentTenant(tenantFound);
        applyTenantTheme(tenantFound);

        // Si es SuperAdmin o estamos en modo app, guardamos la preferencia
        if (user?.rol === "SuperAdmin") {
          localStorage.setItem("currentTenantId", tenantFound.id.toString());
        }
      }
    } catch (error) {
      console.error("Error initializing tenant:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, domainTenant]);

  useEffect(() => {
    initializeTenant();
  }, [initializeTenant]);

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

  const value = {
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
