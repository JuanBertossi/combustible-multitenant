import SubdomainGuard from "@/components/guards/subdomain.guard";
import { Outlet, type RouteObject } from "react-router";
import HomePage from '../../components/pages/_A/Home/HomePage';

export const appRoutes: RouteObject[] = [
  {
    path: "/a",
    element: (
      <SubdomainGuard type="app">
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
