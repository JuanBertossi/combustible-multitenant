/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant debe ser usado dentro de TenantProvider');
  }
  return context;
};

export function TenantProvider({ children }) {
  const { user } = useAuth();
  
  const tenantId = user?.empresaId || null;
  const tenantName = user?.empresa || null;
  const isSuperAdmin = user?.rol === 'SuperAdmin';

  const value = {
    tenantId,
    tenantName,
    isSuperAdmin,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}
