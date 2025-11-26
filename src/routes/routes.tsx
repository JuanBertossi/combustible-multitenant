import { useTenantDomain } from "@/hooks/use-tenant-domain";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router";
import { appRoutes } from "./_AppRoutes/app-routes";
import { tenantRoutes } from "./_TenantRoutes/tenant-routes";

const BaseRedirection = () => {
  const tenantSubDomain = useTenantDomain();

  if (tenantSubDomain === "default") {
    return <Navigate to={"/a"} replace />;
  } else {
    return <Navigate to={"/s"} replace />;
  }
};

export const Routing = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <BaseRedirection />,
    },

    // sector subdominio o tenants
   ...tenantRoutes,

    // sector sin subdominio o default tenant
    ...appRoutes,
  ]);

  return <RouterProvider router={router} />;
};
