// import SubdomainGuard from "@/components/guards/subdomain.guard";
// import { Outlet, type RouteObject } from "react-router";
// import HomePage from '../../components/pages/_A/Home/HomePage';

// export const appRoutes: RouteObject[] = [
//   {
//     path: "/a",
//     element: (
//       <SubdomainGuard type="app">
//         <Outlet />
//       </SubdomainGuard>
//     ),
//     children: [
//       {
//         path: "",
//         element: <HomePage />,
//       },
//     ],
//   },
// ];

import { lazy, Suspense } from "react";
import { Outlet, type RouteObject } from "react-router";
import SubdomainGuard from "@/components/guards/subdomain.guard";

const Login = lazy(() => import("@/pages/Login/Login"));

export const appRoutes: RouteObject[] = [
  {
    path: "/a",
    element: (
      <SubdomainGuard type="app">
        <Suspense fallback={<div>Cargando...</div>}>
          <Outlet />
        </Suspense>
      </SubdomainGuard>
    ),
    children: [
      {
        path: "login",
        element: <Login />,
      },
      // Redirección por defecto: Si entran a midominio.com/a -> Login
      {
        path: "",
        element: <Login />,
      },
    ],
  },
];
