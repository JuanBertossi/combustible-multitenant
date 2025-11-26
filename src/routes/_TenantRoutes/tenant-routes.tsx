import SubdomainGuard from "@/components/guards/subdomain.guard";
import HomePage from "@/components/pages/_S/Home/HomePage";

import { Outlet, type RouteObject } from "react-router";

export const tenantRoutes: RouteObject[] = [
  {
    path: "/s",
    element: (
      <SubdomainGuard type="subdomain">
        <Outlet />
      </SubdomainGuard>
    ),
    children: [
      {
        path: "",
        element: <HomePage />,
      },
    ],
  },
];
