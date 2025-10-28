import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import DashboardLayout from "./components/layout/DashboardLayout";

// Páginas
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Empresas from "./pages/Empresas/Empresas";
import Usuarios from "./pages/Usuarios/Usuarios";
import Vehiculos from "./pages/Vehiculos/Vehiculos";
import Choferes from "./pages/Choferes/Choferes";
import Eventos from "./pages/Eventos/Eventos";
import ValidacionEventos from "./pages/Validacion/ValidacionEventos";
import Configuracion from "./pages/Configuracion/Configuracion";
import Surtidores from "./pages/Surtidores/Surtidores";
import Tanques from "./pages/Tanques/Tanques";
import { TenantProvider } from './context/TenantContext';
/**
 * Componente de ruta protegida
 * Solo permite acceso si el usuario está autenticado
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        Cargando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Rutas principales de la aplicación
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard principal */}
        <Route index element={<Dashboard />} />

        {/* Administración */}
        <Route path="empresas" element={<Empresas />} />
        <Route path="usuarios" element={<Usuarios />} />

        {/* Flota */}
        <Route path="vehiculos" element={<Vehiculos />} />
        <Route path="choferes" element={<Choferes />} />

        {/* Combustible */}
        <Route path="eventos" element={<Eventos />} />
        <Route path="validacion" element={<ValidacionEventos />} />
        <Route path="/surtidores" element={<Surtidores />} />
        <Route path="/tanques" element={<Tanques />} />
        {/* Configuración */}
        <Route path="configuracion" element={<Configuracion />} />
      </Route>

      {/* Ruta 404 - Redirigir al dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * Componente principal de la aplicación
 */
function App() {
  return (
    <AuthProvider>
      <TenantProvider>
          <AppRoutes />
        </TenantProvider>
    </AuthProvider>
  );
}

export default App;
