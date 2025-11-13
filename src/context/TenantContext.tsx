/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";

interface TenantContextType {
  tenantId: number | null;
  tenantName: string | null;
  isSuperAdmin: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant debe ser usado dentro de TenantProvider");
  }
  return context;
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { user } = useAuth();

  const tenantId = user?.empresaId || null;
  const tenantName = user?.empresaNombre || null;
  const isSuperAdmin = user?.rol === "SuperAdmin";

  const value: TenantContextType = {
    tenantId,
    tenantName,
    isSuperAdmin,
  };

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}
