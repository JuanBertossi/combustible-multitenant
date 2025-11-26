import { useTenantContext } from "@/components/providers/tenants/use-tenant";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Home } from "lucide-react";
import { Link } from "react-router";

const domain = import.meta.env.VITE_APP_DOMAIN;

const homePrincipalUrl = `http://${
  import.meta.env.VITE_APP_DOMAIN === "localhost"
    ? `${domain}:${import.meta.env.VITE_APP_PORT || "5177"}`
    : domain
}/a`;

export default function HomePage() {
  const { name } = useTenantContext();

  return (
    <div>
      <Card>
        <CardHeader>Home page tenant: {name}</CardHeader>
        <CardContent>Bienvenido al home page del tenant {name}</CardContent>
        <CardFooter>
          <Button asChild>
            <Link to={homePrincipalUrl} className="w-full flex items-center">
              <Home /> Ir a home app principal
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
