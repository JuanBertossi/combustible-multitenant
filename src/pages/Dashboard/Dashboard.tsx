import { useState } from "react";
import { useTenantContext } from "../../components/providers/tenants/use-tenant"; // Asegúrate que este hook devuelva el tenant actual
import SkeletonLoading from "../../components/common/SkeletonLoading/SkeletonLoading";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningIcon from "@mui/icons-material/Warning";

// ... (Tus interfaces y constantes se mantienen igual) ...
type PeriodoType = "semana" | "mes" | "trimestre" | "anio";

// Interfaces (abreviadas para visualización, mantén las tuyas)
interface ConsumoMensualData {
  mes: string;
  litros: number;
  costo: number;
}
interface ConsumoPorVehiculoData {
  vehiculo: string;
  litros: number;
  eficiencia: number;
}
interface ConsumoPorTipoData {
  tipo: string;
  litros: number;
  porcentaje: number;
  [key: string]: string | number;
}
interface KPIData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const consumoMensual: ConsumoMensualData[] = [
  /* ... tus datos ... */
];
const consumoPorVehiculo: ConsumoPorVehiculoData[] = [
  /* ... tus datos ... */
];
const consumoPorTipo: ConsumoPorTipoData[] = [
  /* ... tus datos ... */
];
const COLORS = ["#1E2C56", "#4A90E2", "#10b981", "#f59e0b"];

// ⭐ AQUÍ FALTABA EL EXPORT DEFAULT
export default function Dashboard() {
  const [periodo, setPeriodo] = useState<PeriodoType>("mes");

  // CORRECCIÓN AQUÍ: Desestructuramos currentTenant
  const { currentTenant: tenant } = useTenantContext();

  // Ajuste de propiedades (asegurando que tenant existe)
  const themeColor = tenant?.colorPrimario || "#1E2C56";

  const kpis: KPIData[] = [
    {
      label: `Consumo Total (${tenant?.nombre || "Empresa"})`,
      value: "32,450 L",
      change: "+12%",
      trend: "up",
      icon: <LocalGasStationIcon sx={{ fontSize: 28 }} />,
      color: themeColor,
      bgColor: themeColor + "15",
    },
    // ... resto de KPIs
    {
      label: "Costo Total",
      value: "$48,675",
      change: "+8%",
      trend: "up",
      icon: <AttachMoneyIcon sx={{ fontSize: 28 }} />,
      color: "#10b981",
      bgColor: "#10b98115",
    },
    {
      label: "Vehículos Activos",
      value: "24",
      change: "+2",
      trend: "up",
      icon: <DirectionsCarIcon sx={{ fontSize: 28 }} />,
      color: "#4A90E2",
      bgColor: "#4A90E215",
    },
    {
      label: "Alertas Pendientes",
      value: "3",
      change: "-5",
      trend: "down",
      icon: <WarningIcon sx={{ fontSize: 28 }} />,
      color: "#f59e0b",
      bgColor: "#f59e0b15",
    },
  ];

  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <SkeletonLoading height={48} count={1} />
        <SkeletonLoading height={120} count={4} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header con nombre del tenant */}
      <Box sx={{ mb: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            color={themeColor}
            sx={{ mb: 2 }}
          >
            {tenant?.nombre ? `Panel de ${tenant.nombre}` : "Panel General"}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel sx={{ fontWeight: 600 }}>Período</InputLabel>
            <Select
              value={periodo}
              onChange={(e: SelectChangeEvent<PeriodoType>) =>
                setPeriodo(e.target.value as PeriodoType)
              }
              label="Período"
            >
              <MenuItem value="semana">Esta semana</MenuItem>
              <MenuItem value="mes">Este mes</MenuItem>
              <MenuItem value="trimestre">Trimestre</MenuItem>
              <MenuItem value="anio">Año</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((kpi, index) => (
          // @ts-expect-error - MUI v7 Grid issue
          <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
            {/* ... contenido de la tarjeta KPI ... */}
            <Card
              elevation={0}
              sx={{ /* ... estilos ... */ borderRadius: 3, height: "100%" }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: kpi.bgColor,
                      p: 1.5,
                      borderRadius: 2,
                      color: kpi.color,
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <Chip
                    label={kpi.change}
                    size="small"
                    color={kpi.trend === "up" ? "success" : "error"}
                    variant="outlined"
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{ color: "#64748b", fontWeight: 600 }}
                >
                  {kpi.label}
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {kpi.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos - Copia el resto de tu JSX de gráficos aquí */}
      <Grid container spacing={3}>
        {/* ... tus gráficos ... */}
      </Grid>
    </Box>
  );
}
