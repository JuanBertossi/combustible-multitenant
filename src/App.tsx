import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";
import SkeletonLoading from "./components/common/SkeletonLoading/SkeletonLoading";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import DashboardLayout from "./components/layout/DashboardLayout";
import { TenantProvider } from "./context/TenantContext";

// Lazy loading de páginas para mejorar rendimiento
const Login = lazy(() => import("./components/pages/Login/Login"));
const Dashboard = lazy(() => import("./components/pages/Dashboard/Dashboard"));
const Empresas = lazy(() => import("./components/pages/Empresas/Empresas"));
const Usuarios = lazy(() => import("./components/pages/Usuarios/Usuarios"));
const Vehiculos = lazy(() => import("./components/pages/Vehiculos/Vehiculos"));
const Choferes = lazy(() => import("./components/pages/Choferes/Choferes"));
const Eventos = lazy(() => import("./components/pages/Eventos/Eventos"));
const ValidacionEventos = lazy(
  () => import("./components/pages/Validacion/ValidacionEventos")
);
const Configuracion = lazy(
  () => import("./components/pages/Configuracion/Configuracion")
);
const Surtidores = lazy(
  () => import("./components/pages/Surtidores/Surtidores")
);
const Tanques = lazy(() => import("./components/pages/Tanques/Tanques"));
const CentrosCosto = lazy(
  () => import("./components/pages/CentroCosto/CentrosCosto")
);
const Reportes = lazy(() => import("./components/pages/reportes/Reportes"));

/**
 * Componente de carga mientras se cargan las páginas lazy
 */
const LoadingFallback = () => <SkeletonLoading height={48} count={6} />;
/**
 * Componente de ruta protegida
 * Solo permite acceso si el usuario está autenticado
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <SkeletonLoading height={48} count={6} />;
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
        {/* --- NUEVA RUTA --- */}
        <Route
          path="centros-costo"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <CentrosCosto />
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

        {/* --- NUEVA RUTA REPORTE --- */}
        <Route
          path="reportes"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Reportes />
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
  //   return (
  //     <ErrorBoundary>
  //       <AuthProvider>
  //         <TenantProvider>
  //           <AppRoutes />
  //         </TenantProvider>
  //       </AuthProvider>
  //     </ErrorBoundary>
  //   );
  // }
  return (
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <ThemeProvider defaultTheme="system" storageKey="multitenant-ui-theme">
          <Routing />
          <Toaster />
        </ThemeProvider>
      </TenantProvider>
    </QueryClientProvider>
  );
}

export default App;
