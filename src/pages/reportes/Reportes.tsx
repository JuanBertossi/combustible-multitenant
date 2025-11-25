import { useState } from "react";
import SkeletonLoading from "../../components/common/SkeletonLoading/SkeletonLoading";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WarningIcon from "@mui/icons-material/Warning";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  mockConsumoVehiculos,
  mockLitrosPorSurtidor,
  mockLitrosPorOperador,
  mockCostoPorCentroCosto,
  mockDesvios,
  mockRankingEficiencia,
} from "../../utils/mockReportes";
import * as XLSX from "xlsx";

type TipoReporte =
  | "consumo-vehiculos"
  | "litros-surtidor"
  | "litros-operador"
  | "costo-centro"
  | "desvios"
  | "ranking-eficiencia";

const COLORS = [
  "#1E2C56",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

export default function Reportes() {
  const [loading, setLoading] = useState<boolean>(false); // Simulación de loading visual
  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <SkeletonLoading height={48} count={1} />
        <SkeletonLoading height={120} count={4} />
      </Box>
    );
  }
  const [tipoReporte, setTipoReporte] =
    useState<TipoReporte>("consumo-vehiculos");

  const handleExport = () => {
    let dataToExport: Record<string, string | number>[] = [];
    let filename = "";

    switch (tipoReporte) {
      case "consumo-vehiculos":
        dataToExport = mockConsumoVehiculos.map((item) => ({
          Vehículo: `${item.vehiculoPatente} - ${item.vehiculoTipo}`,
          "Total Litros": item.litrosTotales,
          "Total Costo": `$${item.costoTotal.toLocaleString()}`,
          Eventos: item.numeroEventos,
          Eficiencia: item.eficienciaKmPorLitro
            ? `${item.eficienciaKmPorLitro.toFixed(2)} km/L`
            : `${item.eficienciaLitrosPorHora?.toFixed(2)} L/h`,
        }));
        filename = "Consumo_por_Vehiculos";
        break;
      case "litros-surtidor":
        dataToExport = mockLitrosPorSurtidor.map((item) => ({
          Surtidor: item.surtidorNombre,
          "Total Litros": item.litrosTotales,
          "Total Costo": `$${item.costoTotal.toLocaleString()}`,
          Eventos: item.numeroEventos,
        }));
        filename = "Litros_por_Surtidor";
        break;
      case "litros-operador":
        dataToExport = mockLitrosPorOperador.map((item) => ({
          Operador: `${item.choferNombre} ${item.choferApellido}`,
          "Total Litros": item.litrosTotales,
          Eventos: item.numeroEventos,
          "Vehículos Usados": item.vehiculosMasUsados.join(", "),
        }));
        filename = "Litros_por_Operador";
        break;
      case "costo-centro":
        dataToExport = mockCostoPorCentroCosto.map((item) => ({
          "Centro de Costo": `${item.centroCostoCodigo} - ${item.centroCostoNombre}`,
          Tipo: item.centroCostoTipo,
          "Total Litros": item.litrosTotales,
          "Total Costo": `$${item.costoTotal.toLocaleString()}`,
          Eventos: item.numeroEventos,
          Vehículos: item.vehiculosAsignados,
        }));
        filename = "Costos_por_Centro_de_Costo";
        break;
      case "desvios":
        dataToExport = mockDesvios.map((item) => ({
          "Evento ID": item.eventoId,
          Fecha: new Date(item.fecha).toLocaleDateString(),
          Vehículo: item.vehiculoPatente,
          Chofer: item.choferNombre,
          Litros: item.litros,
          Tipo: item.tipoDesvio,
          Severidad: item.severidad,
          Descripción: item.descripcion,
        }));
        filename = "Analisis_de_Desvios";
        break;
      case "ranking-eficiencia":
        dataToExport = mockRankingEficiencia.map((item) => ({
          Posición: item.posicion,
          Vehículo: `${item.vehiculoPatente} - ${item.vehiculoTipo}`,
          Eficiencia: item.eficiencia,
          "Total Litros": item.litrosTotales,
          Tendencia: item.tendencia,
        }));
        filename = "Ranking_de_Eficiencia";
        break;
    }

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(
      wb,
      `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
              Sistema de Reportes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Análisis completo de consumo, costos, eficiencia y desvíos
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            sx={{
              bgcolor: "#10b981",
              fontWeight: 600,
              "&:hover": { bgcolor: "#059669" },
            }}
          >
            Exportar a Excel
          </Button>
        </Box>

        {/* Tabs para seleccionar tipo de reporte */}
        <Tabs
          value={tipoReporte}
          onChange={(_, newValue) => setTipoReporte(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              minHeight: 64,
            },
          }}
        >
          <Tab
            value="consumo-vehiculos"
            icon={<LocalShippingIcon />}
            iconPosition="start"
            label="Consumo por Vehículo"
          />
          <Tab
            value="litros-surtidor"
            icon={<LocalGasStationIcon />}
            iconPosition="start"
            label="Litros por Surtidor"
          />
          <Tab
            value="litros-operador"
            icon={<PersonIcon />}
            iconPosition="start"
            label="Litros por Operador"
          />
          <Tab
            value="costo-centro"
            icon={<AccountBalanceIcon />}
            iconPosition="start"
            label="Costos Centro de Costo"
          />
          <Tab
            value="desvios"
            icon={<WarningIcon />}
            iconPosition="start"
            label="Análisis de Desvíos"
          />
          <Tab
            value="ranking-eficiencia"
            icon={<EmojiEventsIcon />}
            iconPosition="start"
            label="Ranking Eficiencia"
          />
        </Tabs>
      </Box>

      {/* Reporte 1: Consumo por Vehículo */}
      {tipoReporte === "consumo-vehiculos" && (
        <Grid container spacing={3}>
          {/* Gráfico de Barras */}
          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  Total de Litros por Vehículo
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockConsumoVehiculos}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="vehiculoPatente" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [`${value} L`, "Litros"]}
                    />
                    <Bar
                      dataKey="litrosTotales"
                      fill="#1E2C56"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* KPIs */}
          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  bgcolor: "#1E2C5608",
                }}
              >
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Total Litros
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#1E2C56">
                    {mockConsumoVehiculos
                      .reduce((sum, item) => sum + item.litrosTotales, 0)
                      .toLocaleString()}{" "}
                    L
                  </Typography>
                </CardContent>
              </Card>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  bgcolor: "#10b98108",
                }}
              >
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Costo Total
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#10b981">
                    $
                    {mockConsumoVehiculos
                      .reduce((sum, item) => sum + item.costoTotal, 0)
                      .toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
              <Card
                elevation={0}
                sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
              >
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Total Cargas
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {mockConsumoVehiculos.reduce(
                      (sum, item) => sum + item.numeroEventos,
                      0
                    )}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Tabla */}
          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid item xs={12}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Vehículo</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                          Total Litros
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                          Costo Total
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                          Eventos
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                          Eficiencia
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockConsumoVehiculos.map((item) => (
                        <TableRow key={item.vehiculoId} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {item.vehiculoPatente}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.vehiculoTipo}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {item.litrosTotales.toLocaleString()} L
                          </TableCell>
                          <TableCell align="right">
                            ${item.costoTotal.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            {item.numeroEventos}
                          </TableCell>
                          <TableCell align="right">
                            {item.eficienciaKmPorLitro
                              ? `${item.eficienciaKmPorLitro.toFixed(2)} km/L`
                              : `${item.eficienciaLitrosPorHora?.toFixed(
                                  2
                                )} L/h`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reporte 2: Litros por Surtidor */}
      {tipoReporte === "litros-surtidor" && (
        <Grid container spacing={3}>
          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid item xs={12} md={7}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  Distribución de Litros por Surtidor
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockLitrosPorSurtidor} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e0e0e0"
                      horizontal={false}
                    />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis
                      dataKey="surtidorNombre"
                      type="category"
                      stroke="#64748b"
                      width={150}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                      }}
                      formatter={(value) => [`${value} L`, "Litros"]}
                    />
                    <Bar
                      dataKey="litrosTotales"
                      fill="#3b82f6"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid item xs={12} md={5}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  Proporción de Uso
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={mockLitrosPorSurtidor}
                      dataKey="litrosTotales"
                      nameKey="surtidorNombre"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label
                    >
                      {mockLitrosPorSurtidor.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} L`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reporte 2: Litros por Operador */}
      {tipoReporte === "litros-operador" && (
        <Grid container spacing={3}>
          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid item xs={12}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  Consumo por Operador
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockLitrosPorOperador}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="choferNombre" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="litrosTotales"
                      name="Total Litros"
                      fill="#10b981"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="numeroEventos"
                      name="Cantidad Eventos"
                      fill="#f59e0b"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reporte 4: Costos por Centro de Costo */}
      {tipoReporte === "costo-centro" && (
        <Grid container spacing={3}>
          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid item xs={12} md={8}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  Costos por Centro de Costo
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockCostoPorCentroCosto}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="centroCostoCodigo" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                      }}
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Costo",
                      ]}
                    />
                    <Bar
                      dataKey="costoTotal"
                      fill="#8b5cf6"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {mockCostoPorCentroCosto.map((cc) => (
                <Card
                  key={cc.centroCostoId}
                  elevation={0}
                  sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {cc.centroCostoCodigo}
                      </Typography>
                      <Chip
                        label={cc.centroCostoTipo}
                        size="small"
                        sx={{
                          fontSize: "0.7rem",
                          height: 20,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1 }}
                    >
                      {cc.centroCostoNombre}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#8b5cf6">
                      ${cc.costoTotal.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cc.litrosTotales.toLocaleString()} L • {cc.numeroEventos}{" "}
                      cargas
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Reporte 5: Análisis de Desvíos */}
      {tipoReporte === "desvios" && (
        <Grid container spacing={3}>
          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid item xs={12}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 4, borderBottom: "1px solid #e0e0e0" }}>
                  <Typography variant="h6" fontWeight={700}>
                    Análisis de Desvíos de Combustible
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Eventos que requieren revisión por anomalías detectadas
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: "#f8f9fa" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Evento</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Vehículo</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Chofer</TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="right">
                          Litros
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">
                          Tipo Desvío
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700 }} align="center">
                          Severidad
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockDesvios.map((item) => (
                        <TableRow key={item.eventoId} hover>
                          <TableCell>#{item.eventoId}</TableCell>
                          <TableCell>
                            {new Date(item.fecha).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{item.vehiculoPatente}</TableCell>
                          <TableCell>{item.choferNombre}</TableCell>
                          <TableCell align="right">{item.litros} L</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={item.tipoDesvio}
                              size="small"
                              sx={{
                                bgcolor:
                                  item.tipoDesvio === "exceso"
                                    ? "#ef444415"
                                    : "#3b82f615",
                                color:
                                  item.tipoDesvio === "exceso"
                                    ? "#ef4444"
                                    : "#3b82f6",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={item.severidad}
                              size="small"
                              color={
                                item.severidad === "alta"
                                  ? "error"
                                  : item.severidad === "media"
                                  ? "warning"
                                  : "success"
                              }
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reporte 6: Ranking de Eficiencia */}
      {tipoReporte === "ranking-eficiencia" && (
        <Grid container spacing={3}>
          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid item xs={12} md={7}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  Eficiencia de Combustible
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockRankingEficiencia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="vehiculoPatente" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #e0e0e0",
                      }}
                      formatter={(value) => [`${value}`, "Eficiencia"]}
                    />
                    <Bar
                      dataKey="eficiencia"
                      fill="#10b981"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
          <Grid item xs={12} md={5}>
            <Card
              elevation={0}
              sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                  Podio de Eficiencia
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {mockRankingEficiencia.slice(0, 3).map((item) => (
                    <Card
                      key={item.vehiculoId}
                      elevation={0}
                      sx={{
                        border:
                          item.posicion === 1
                            ? "2px solid #10b981"
                            : "1px solid #e0e0e0",
                        borderRadius: 2,
                        bgcolor:
                          item.posicion === 1 ? "#10b98108" : "transparent",
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              bgcolor:
                                item.posicion === 1
                                  ? "#10b981"
                                  : item.posicion === 2
                                  ? "#64748b"
                                  : "#cd7f32",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                            }}
                          >
                            <EmojiEventsIcon />
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" fontWeight={700}>
                              #{item.posicion} • {item.vehiculoPatente}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.vehiculoTipo}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              color="#10b981"
                            >
                              {item.eficiencia.toFixed(1)}
                            </Typography>
                            <Chip
                              label={item.tendencia}
                              size="small"
                              sx={{
                                fontSize: "0.65rem",
                                height: 18,
                                bgcolor:
                                  item.tendencia === "mejorando"
                                    ? "#10b98115"
                                    : item.tendencia === "empeorando"
                                    ? "#ef444415"
                                    : "#64748b15",
                                color:
                                  item.tendencia === "mejorando"
                                    ? "#10b981"
                                    : item.tendencia === "empeorando"
                                    ? "#ef4444"
                                    : "#64748b",
                              }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
