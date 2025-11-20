import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";
import CargarEventoForm, { EventoFormData } from "../../components/eventos/CargarEventoForm";
import EventoDetalle from "../../components/eventos/EventoDetalle";
import { mockEventos } from "../../utils/mockData";
import { getEvidenciasByEvento } from "../../utils/mockEvidencias";
import { useAuth } from "../../hooks/useAuth";
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";
import { ESTADOS_EVENTO } from "../../utils/constants";
import * as XLSX from "xlsx";
import type { Evento } from "../../types";

const estadosEvento: string[] = [
  "Todos",
  ESTADOS_EVENTO.PENDIENTE ?? "",
  ESTADOS_EVENTO.VALIDADO ?? "",
  ESTADOS_EVENTO.RECHAZADO ?? "",
  ESTADOS_EVENTO.FINALIZADO ?? "",
];

interface EventoExtended extends Evento {
  vehiculo?: string;
  chofer?: string;
  surtidor?: string;
  empresa?: string;
  lote?: string;
  labor?: string;
  costo?: number;
  kmInicial?: number;
  kmFinal?: number;
  ruta?: string;
}

export default function Eventos() {
  const { user } = useAuth();
  const [eventos] = useState<EventoExtended[]>(mockEventos as EventoExtended[]);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterEstado, setFilterEstado] = useState<string>("Todos");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [selectedEvento, setSelectedEvento] = useState<EventoExtended | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const eventosPorEmpresa =
    user?.rol === "SuperAdmin"
      ? eventos
      : eventos.filter((e) => e.empresaId === user?.empresaId);

  const filteredEventos = eventosPorEmpresa.filter((e) => {
    const matchSearch =
      (e.vehiculo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.chofer || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEstado = filterEstado === "Todos" || e.estado === filterEstado;

    let matchDate = true;
    if (startDate && endDate) {
      const eventDate = parseISO(e.fecha);
      matchDate = isWithinInterval(eventDate, {
        start: startOfDay(parseISO(startDate)),
        end: endOfDay(parseISO(endDate)),
      });
    } else if (startDate) {
      const eventDate = parseISO(e.fecha);
      matchDate = eventDate >= startOfDay(parseISO(startDate));
    } else if (endDate) {
      const eventDate = parseISO(e.fecha);
      matchDate = eventDate <= endOfDay(parseISO(endDate));
    }

    return matchSearch && matchEstado && matchDate;
  });

  const handleExport = (): void => {
    const dataToExport = filteredEventos.map((e) => ({
      ID: e.id,
      ...(user?.rol === "SuperAdmin" && {
        Empresa: e.empresa || e.empresaNombre,
      }),
      Fecha: format(new Date(e.fecha), "dd/MM/yyyy HH:mm"),
      Vehículo: e.vehiculo || e.vehiculoPatente || "",
      Chofer: e.chofer || e.choferNombre || "",
      Litros: e.litros,
      Costo: e.costo || e.total || 0,
      "Precio/L": ((e.costo || e.total || 0) / e.litros).toFixed(2),
      Estado: e.estado,
      ...(e.kmInicial && {
        "Km Inicial": e.kmInicial,
        "Km Final": e.kmFinal,
        Recorrido: (e.kmFinal ?? 0) - (e.kmInicial ?? 0),
      }),
      ...(e.lote && {
        Lote: e.lote,
        Labor: e.labor,
      }),
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Eventos");
    XLSX.writeFile(
      wb,
      `Eventos_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const handleView = (evento: EventoExtended): void => {
    setSelectedEvento(evento);
    setOpenDialog(true);
  };

  const handleSubmitEvento = async (data: EventoFormData): Promise<void> => {
    // Simular creación de evento
    const newId = Math.max(...eventos.map((e) => e.id)) + 1;
    
    const vehiculo = mockEventos.find(e => e.vehiculoId === data.vehiculoId)?.vehiculo || "Vehículo Desconocido";
    const chofer = mockEventos.find(e => e.choferId === data.choferId)?.chofer || "Chofer Desconocido";
    
    const nuevoEvento: EventoExtended = {
      id: newId,
      empresaId: user?.empresaId || 1,
      vehiculoId: data.vehiculoId!,
      choferId: data.choferId!,
      fecha: data.fecha,
      litros: data.litros!,
      estado: ESTADOS_EVENTO.PENDIENTE,
      vehiculo: vehiculo,
      chofer: chofer,
      // Datos simulados o calculados
      costo: (data.litros || 0) * 1050, // Precio mock
      total: (data.litros || 0) * 1050,
      kmInicial: data.odometro ? data.odometro - 100 : undefined, // Mock anterior
      kmFinal: data.odometro || undefined,
      latitud: data.latitud || undefined,
      longitud: data.longitud || undefined,
    };

    // Actualizar estado local para reflejar el cambio en la UI
    // @ts-expect-error - setEventos no está tipado explícitamente en el useState original pero React lo infiere
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEventos((prev: any[]) => [nuevoEvento, ...prev]);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mostrar feedback (podría ser un Toast en el futuro)
    console.log("Evento creado:", nuevoEvento);
  };

  interface EstadoColors {
    bg: string;
    color: string;
  }

  type EventoEstadoKey = "Validado" | "Pendiente" | "Rechazado" | "Finalizado";

  const getEstadoColor = (estado: string): EstadoColors => {
    const colors: Record<EventoEstadoKey, EstadoColors> = {
      Validado: { bg: "#10b98115", color: "#10b981" },
      Pendiente: { bg: "#f59e0b15", color: "#f59e0b" },
      Rechazado: { bg: "#ef444415", color: "#ef4444" },
      Finalizado: { bg: "#3b82f615", color: "#3b82f6" },
    };
    return (
      colors[estado as EventoEstadoKey] ?? { bg: "#99999915", color: "#999" }
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
              Eventos de Combustible
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Historial completo de cargas • {filteredEventos.length}{" "}
              {filteredEventos.length === 1 ? "evento" : "eventos"}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenFormDialog(true)}
            sx={{
              bgcolor: "#10b981",
              fontWeight: 600,
              "&:hover": { bgcolor: "#059669" },
            }}
          >
            Nuevo Evento
          </Button>
        </Box>

        {/* Filtros */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            bgcolor: "white",
            p: 2.5,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
          }}
        >
          <TextField
            placeholder="Buscar por vehículo o chofer..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#999" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            type="date"
            size="small"
            label="Desde"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          />

          <TextField
            type="date"
            size="small"
            label="Hasta"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 150 }}
          />

          <TextField
            select
            size="small"
            label="Estado"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            {estadosEvento.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            disabled={filteredEventos.length === 0}
            sx={{
              borderColor: "#10b981",
              color: "#10b981",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#059669",
                bgcolor: "#10b98110",
              },
            }}
          >
            Exportar
          </Button>
        </Box>
      </Box>

      {/* Timeline de eventos */}
      <Grid container spacing={3}>
        {filteredEventos.map((evento) => (
          /* @ts-expect-error - MUI v7 Grid type incompatibility */
          <Grid item xs={12} key={evento.id}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
                  {/* Ícono */}
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: `${getEstadoColor(evento.estado).bg}`,
                      color: getEstadoColor(evento.estado).color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <LocalGasStationIcon sx={{ fontSize: 28 }} />
                  </Box>

                  {/* Contenido */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight="700"
                          sx={{ mb: 0.5 }}
                        >
                          #{evento.id} • {evento.vehiculo}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(evento.fecha), "dd/MM/yyyy HH:mm")} •{" "}
                          {evento.chofer}
                        </Typography>
                      </Box>
                      <Chip
                        label={evento.estado}
                        size="small"
                        sx={{
                          bgcolor: getEstadoColor(evento.estado).bg,
                          color: getEstadoColor(evento.estado).color,
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    {/* Métricas */}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
                      <Grid item xs={6} sm={3}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          Litros Cargados
                        </Typography>
                        <Typography variant="h6" fontWeight="700">
                          {evento.litros} L
                        </Typography>
                      </Grid>
                      {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
                      <Grid item xs={6} sm={3}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          Costo Total
                        </Typography>
                        <Typography variant="h6" fontWeight="700">
                          $
                          {(evento.costo || evento.total || 0).toLocaleString()}
                        </Typography>
                      </Grid>
                      {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
                      <Grid item xs={6} sm={3}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          Precio/Litro
                        </Typography>
                        <Typography variant="h6" fontWeight="700">
                          $
                          {(
                            (evento.costo || evento.total || 0) / evento.litros
                          ).toFixed(2)}
                        </Typography>
                      </Grid>
                      {evento.kmInicial && (
                        /* @ts-expect-error - MUI v7 Grid type incompatibility */
                        <Grid item xs={6} sm={3}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block" }}
                          >
                            Recorrido
                          </Typography>
                          <Typography variant="h6" fontWeight="700">
                            {(evento.kmFinal ?? 0) - (evento.kmInicial ?? 0)} km
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    {/* Acciones */}
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleView(evento)}
                        sx={{
                          borderColor: "#e0e0e0",
                          color: "#1E2C56",
                          fontWeight: 600,
                          "&:hover": {
                            borderColor: "#1E2C56",
                            bgcolor: "#1E2C5610",
                          },
                        }}
                      >
                        Ver Detalle
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredEventos.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <LocalGasStationIcon sx={{ fontSize: 64, color: "#ddd", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay eventos registrados
          </Typography>
        </Box>
      )}

      {/* Dialog de detalle usando el componente reutilizable */}
      {selectedEvento && (
        <EventoDetalle
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          evento={selectedEvento}
          evidencias={getEvidenciasByEvento(selectedEvento.id)}
          // No pasamos onValidate ni onReject para modo "solo lectura"
          // o podemos pasarlos si queremos permitir validar desde aquí
        />
      )}

      {/* Formulario de Carga Manual */}
      <CargarEventoForm
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        onSubmit={handleSubmitEvento}
      />
    </Box>
  );
}
