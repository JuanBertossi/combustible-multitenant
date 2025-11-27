import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

import { QueryClientProvider } from "@tanstack/react-query";
import { Routing } from "./routes/routes";
import { TenantProvider } from "./components/providers/tenants/tenant-provider";
import { ThemeProvider } from "./components/providers/theme/theme-provider";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <ThemeProvider defaultTheme="system" storageKey="multitenant-ui-theme">
          <Routing />
        </ThemeProvider>
      </TenantProvider>
    </QueryClientProvider>
  );
}

export default App;
