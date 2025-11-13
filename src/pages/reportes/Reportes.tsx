import { useState } from "react";
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
  SelectChangeEvent,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  LinearProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AssessmentIcon from "@mui/icons-material/Assessment";
import {
  mockEventos,
  mockVehiculos,
  mockSurtidores,
} from "../../utils/mockData";
import { mockTanques } from "../../pages/Tanques/Tanques";
import { formatNumber } from "../../utils/formatters";
import * as XLSX from "xlsx";

type PeriodoType = "semana" | "mes" | "trimestre" | "anio";

// --- Procesamiento de Datos para Reportes ---

// 1. Reporte de Eficiencia (L/100km)
const getReporteEficiencia = () => {
  return mockVehiculos
    .map((vehiculo) => {
      const eventosVehiculo = mockEventos.filter(
        (e) =>
          e.vehiculo?.startsWith(vehiculo.patente) && e.kmFinal && e.kmInicial
      );
      if (eventosVehiculo.length === 0) return null;

      const totalLitros = eventosVehiculo.reduce((acc, e) => acc + e.litros, 0);
      const minKm = Math.min(...eventosVehiculo.map((e) => e.kmInicial || 0));
      const maxKm = Math.max(...eventosVehiculo.map((e) => e.kmFinal || 0));
      const totalKm = maxKm - minKm;

      if (totalKm <= 0) return null;

      const eficiencia = (totalLitros / totalKm) * 100; // L/100km

      return {
        id: vehiculo.id,
        vehiculo: `${vehiculo.patente} (${vehiculo.marca} ${vehiculo.modelo})`,
        totalLitros,
        totalKm,
        eficiencia,
      };
    })
    .filter((v) => v !== null)
    .sort((a, b) => (a?.eficiencia || 0) - (b?.eficiencia || 0)); // Ranking de eficiencia (menor es mejor)
};

// 2. Reporte de Consumo por Surtidor
const getReportePorSurtidor = () => {
  const consumo: Record<string, number> = {};

  // Simulación: Asignar eventos a surtidores (ya que mockEventos no tiene surtidorId)
  mockEventos.forEach((evento, index) => {
    const surtidor = mockSurtidores[index % mockSurtidores.length];
    if (!surtidor) return;
    const nombreSurtidor = surtidor.codigo || "Desconocido";
    if (!consumo[nombreSurtidor]) {
      consumo[nombreSurtidor] = 0;
    }
    consumo[nombreSurtidor] += evento.litros;
  });

  return Object.keys(consumo).map((nombre) => ({
    name: nombre,
    litros: consumo[nombre],
  }));
};

// 3. Reporte de Stock en Tanques
const getReporteStockTanques = () => {
  return mockTanques.map((tanque) => {
    const percentage = (tanque.nivelActual / tanque.capacidadMaxima) * 100;
    let color: "success" | "warning" | "error" = "success";
    if (percentage < 50) color = "warning";
    if (percentage < 25) color = "error";

    return {
      ...tanque,
      percentage,
      color,
    };
  });
};

export default function Reportes() {
  const [periodo, setPeriodo] = useState<PeriodoType>("mes");

  const reporteEficiencia = getReporteEficiencia();
  const reportePorSurtidor = getReportePorSurtidor();
  const reporteStock = getReporteStockTanques();

  const handleExportEficiencia = () => {
    const dataToExport = reporteEficiencia.map((item) => ({
      Vehículo: item?.vehiculo,
      "Litros Totales": item?.totalLitros,
      "Km Totales": item?.totalKm,
      "Eficiencia (L/100km)": item?.eficiencia.toFixed(2),
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "EficienciaVehiculos");
    XLSX.writeFile(
      wb,
      `Reporte_Eficiencia_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
            Reportes Avanzados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Análisis de consumo, eficiencia y stock.
          </Typography>
        </Box>
        <FormControl
          size="small"
          sx={{
            minWidth: 200,
            "& .MuiOutlinedInput-root": {
              bgcolor: "white",
              borderRadius: 2,
              fontWeight: 600,
            },
          }}
        >
          <InputLabel>Período</InputLabel>
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

      {/* Grid de Reportes */}
      <Grid container spacing={3}>
        {/* --- Reporte 1: Ranking de Eficiencia (L/100km) --- */}
        {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight="700" color="#1e293b">
                  Ranking de Eficiencia (L/100km)
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExportEficiencia}
                  size="small"
                >
                  Exportar
                </Button>
              </Box>
              <TableContainer
                component={Paper}
                elevation={0}
                variant="outlined"
              >
                <Table>
                  <TableHead sx={{ bgcolor: "#f8fafc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Ranking</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Vehículo
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Litros Totales
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Km Totales
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="right">
                        Eficiencia (L/100km)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reporteEficiencia.map((item, index) => (
                      <TableRow key={item?.id} hover>
                        <TableCell>
                          <Typography
                            fontWeight="bold"
                            color={
                              index === 0 ? "success.main" : "text.primary"
                            }
                          >
                            #{index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>{item?.vehiculo}</TableCell>
                        <TableCell align="right">
                          {formatNumber(item?.totalLitros)} L
                        </TableCell>
                        <TableCell align="right">
                          {formatNumber(item?.totalKm)} km
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            fontWeight="bold"
                            color={
                              index === 0 ? "success.main" : "text.primary"
                            }
                          >
                            {item?.eficiencia.toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* --- Reporte 2: Consumo por Surtidor --- */}
        {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
        <Grid item xs={12} md={7}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                fontWeight="700"
                color="#1e293b"
                sx={{ mb: 4 }}
              >
                Consumo por Surtidor
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={reportePorSurtidor}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    horizontal={false}
                  />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: "#e2e8f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [
                      `${formatNumber(value as number)} L`,
                      "Litros",
                    ]}
                  />
                  <Bar
                    dataKey="litros"
                    fill="#1E2C56"
                    radius={[0, 8, 8, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* --- Reporte 3: Stock por Tanque (KPI) --- */}
        {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
        <Grid item xs={12} md={5}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                fontWeight="700"
                color="#1e293b"
                sx={{ mb: 4 }}
              >
                Stock Actual en Tanques
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {reporteStock.map((tanque) => (
                  <Box key={tanque.id}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" fontWeight="600">
                        {tanque.codigo} - {tanque.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={
                          tanque.color === "error"
                            ? "error.main"
                            : "text.primary"
                        }
                      >
                        {tanque.percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={tanque.percentage}
                      color={tanque.color}
                      sx={{ height: 10, borderRadius: 1, mb: 0.5 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatNumber(tanque.nivelActual)} /{" "}
                      {formatNumber(tanque.capacidadMaxima)} L
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Placeholder para Mapa de Cargas */}
        {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
          >
            <CardContent
              sx={{
                p: 4,
                textAlign: "center",
                minHeight: 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AssessmentIcon sx={{ fontSize: 64, color: "#ddd", mb: 2 }} />
              <Typography variant="h6" fontWeight="700" color="text.secondary">
                Mapa de Cargas (Heatmap)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aquí se integraría un mapa (ej: Google Maps, Leaflet) para
                visualizar la ubicación de las cargas.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
