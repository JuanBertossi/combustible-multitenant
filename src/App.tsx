import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import DashboardLayout from "./components/layout/DashboardLayout";
import { TenantProvider } from "./context/TenantContext";

// Lazy loading de páginas para mejorar rendimiento
const Login = lazy(() => import("./pages/Login/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Empresas = lazy(() => import("./pages/Empresas/Empresas"));
const Usuarios = lazy(() => import("./pages/Usuarios/Usuarios"));
const Vehiculos = lazy(() => import("./pages/Vehiculos/Vehiculos"));
const Choferes = lazy(() => import("./pages/Choferes/Choferes"));
const Eventos = lazy(() => import("./pages/Eventos/Eventos"));
const ValidacionEventos = lazy(
  () => import("./pages/Validacion/ValidacionEventos")
);
const Configuracion = lazy(() => import("./pages/Configuracion/Configuracion"));
const Surtidores = lazy(() => import("./pages/Surtidores/Surtidores"));
const Tanques = lazy(() => import("./pages/Tanques/Tanques"));

/**
 * Componente de carga mientras se cargan las páginas lazy
 */
const LoadingFallback = () => (
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
/**
 * Componente de ruta protegida
 * Solo permite acceso si el usuario está autenticado
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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
      <Route
        path="/login"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        }
      />

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
        <Route
          index
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          }
        />

        {/* Administración */}
        <Route
          path="empresas"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Empresas />
            </Suspense>
          }
        />
        <Route
          path="usuarios"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Usuarios />
            </Suspense>
          }
        />

        {/* Flota */}
        <Route
          path="vehiculos"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Vehiculos />
            </Suspense>
          }
        />
        <Route
          path="choferes"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Choferes />
            </Suspense>
          }
        />

        {/* Combustible */}
        <Route
          path="eventos"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Eventos />
            </Suspense>
          }
        />
        <Route
          path="validacion"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ValidacionEventos />
            </Suspense>
          }
        />
        <Route
          path="/surtidores"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Surtidores />
            </Suspense>
          }
        />
        <Route
          path="/tanques"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Tanques />
            </Suspense>
          }
        />
        {/* Configuración */}
        <Route
          path="configuracion"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Configuracion />
            </Suspense>
          }
        />
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
