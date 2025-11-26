import { useTenantDomain } from "@/hooks/use-tenant-domain";
import React from "react";
import { Navigate } from "react-router";

type Props = {
  children: React.ReactNode;
  type: "subdomain" | "app";
};

export default function SubdomainGuard({ children, type }: Props) {
  const tenantSubDomain = useTenantDomain();

  console.log(tenantSubDomain)

  if (type === "subdomain") {
    if (tenantSubDomain === "default") {
      return <Navigate to={"/a"} />;
    }
  } else if (type === "app") {
    if (tenantSubDomain !== "default") {
      return <Navigate to={"/s"} />;
    }
  }

  return (
    <div>
      Subdomain Guard
      {children}
    </div>
  );
}
