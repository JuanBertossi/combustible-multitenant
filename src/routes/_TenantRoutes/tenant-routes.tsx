import { lazy, Suspense } from "react";
import { Outlet, type RouteObject } from "react-router";
import SubdomainGuard from "@/components/guards/subdomain.guard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import SkeletonLoading from "@/components/common/SkeletonLoading/SkeletonLoading";

// Helper para evitar errores de importación con lazy
const loadPage = (factory: () => Promise<{ default: any }>) => lazy(factory);

// Importación de TODAS tus páginas existentes
const Dashboard = loadPage(() => import("@/pages/Dashboard/Dashboard"));
const Empresas = loadPage(() => import("@/pages/Empresas/Empresas"));
const Usuarios = loadPage(() => import("@/pages/Usuarios/Usuarios"));
const Vehiculos = loadPage(() => import("@/pages/Vehiculos/Vehiculos"));
const Choferes = loadPage(() => import("@/pages/Choferes/Choferes"));
const Eventos = loadPage(() => import("@/pages/Eventos/Eventos"));
const ValidacionEventos = loadPage(
  () => import("@/pages/Validacion/ValidacionEventos")
);
const Configuracion = loadPage(
  () => import("@/pages/Configuracion/Configuracion")
);
const Surtidores = loadPage(() => import("@/pages/Surtidores/Surtidores"));
const Tanques = loadPage(() => import("@/pages/Tanques/Tanques"));
const CentrosCosto = loadPage(() => import("@/pages/CentroCosto/CentrosCosto"));
const Reportes = loadPage(() => import("@/pages/reportes/Reportes"));

const LoadingFallback = () => (
  <div style={{ padding: 20 }}>
    <SkeletonLoading height={48} count={1} />
    <SkeletonLoading height={200} count={3} />
  </div>
);

export const tenantRoutes: RouteObject[] = [
  {
    path: "/s", // Prefijo para rutas de tenant
    element: (
      <SubdomainGuard type="subdomain">
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      </SubdomainGuard>
    ),
    children: [
      {
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        ),
        children: [
          // Rutas relativas a /s
          { path: "", element: <Dashboard /> },
          { path: "empresas", element: <Empresas /> },
          { path: "usuarios", element: <Usuarios /> },
          { path: "vehiculos", element: <Vehiculos /> },
          { path: "choferes", element: <Choferes /> },
          { path: "eventos", element: <Eventos /> },
          { path: "validacion", element: <ValidacionEventos /> },
          { path: "surtidores", element: <Surtidores /> },
          { path: "tanques", element: <Tanques /> },
          { path: "centros-costo", element: <CentrosCosto /> },
          { path: "reportes", element: <Reportes /> },
          { path: "configuracion", element: <Configuracion /> },
        ],
      },
    ],
  },
];
