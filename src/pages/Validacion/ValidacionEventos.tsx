import { useState, useMemo } from "react";
import SkeletonLoading from "../../common/SkeletonLoading/SkeletonLoading";
import {
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import EventoDetalle from "../../eventos/EventoDetalle";
import { mockEventos } from "../../../utils/mockData";
import { getEvidenciasByEvento } from "../../../utils/mockEvidencias";
import { useAuth } from "../../../hooks/useAuth";
import { format } from "date-fns";

import { ESTADOS_EVENTO } from "../../../utils/constants";
import type { Evento } from "../../../types";
import {
  validarEventoConPoliticas,
  getResumenValidacion,
  ValidationResult,
} from "../../../utils/validacionPoliticas";
import { mockPolitica, mockUmbrales } from "../../../utils/mockPoliticas";

interface EventoExtended extends Evento {
  vehiculo?: string;
  chofer?: string;
  costo?: number;
  kmInicial?: number;
  kmFinal?: number;
  ruta?: string;
  lote?: string;
  labor?: string;
  motivoRechazo?: string;
}

export default function ValidacionEventos() {
  const { user } = useAuth();
  const [loading] = useState<boolean>(false); // Simulación de loading visual
  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <SkeletonLoading height={48} count={1} />
        <SkeletonLoading height={120} count={4} />
      </Box>
    );
  }
  const [eventos, setEventos] = useState<EventoExtended[]>(
    mockEventos as EventoExtended[]
  );
  const [selectedEvento, setSelectedEvento] = useState<EventoExtended | null>(
    null
  );
  const [openDetalleDialog, setOpenDetalleDialog] = useState<boolean>(false);
  const [openRejectDialog, setOpenRejectDialog] = useState<boolean>(false);
  const [motivo, setMotivo] = useState<string>("");

  const eventosPendientes = eventos.filter((e) => {
    const isPendiente = e.estado === ESTADOS_EVENTO.PENDIENTE;
    const isEmpresa =
      user?.rol === "SuperAdmin" || e.empresaId === user?.empresaId;
    return isPendiente && isEmpresa;
  });

  // Memoize validation results to avoid recalculating on every render
  const validationResults = useMemo(() => {
    const results = new Map<number, ValidationResult>();
    eventosPendientes.forEach((evento) => {
      const evidencias = getEvidenciasByEvento(evento.id);
      // En un caso real, buscaríamos la política de la empresa del evento
      // y el umbral del vehículo específico
      const umbral = mockUmbrales.find(
        (u) => u.vehiculoId === evento.vehiculoId
      );

      const result = validarEventoConPoliticas(
        evento,
        evidencias,
        mockPolitica,
        umbral
      );
      results.set(evento.id, result);
    });
    return results;
  }, [eventosPendientes]);

  const handleViewDetalle = (evento: EventoExtended): void => {
    setSelectedEvento(evento);
    setOpenDetalleDialog(true);
  };

  const handleValidate = (evento: EventoExtended): void => {
    setEventos(
      eventos.map((e) =>
        e.id === evento.id
          ? ({ ...e, estado: ESTADOS_EVENTO.VALIDADO } as EventoExtended)
          : e
      )
    );
    setOpenDetalleDialog(false);
    setSelectedEvento(null);
  };

  const handleRejectClick = (evento: EventoExtended): void => {
    setSelectedEvento(evento);
    setOpenDetalleDialog(false);
    setOpenRejectDialog(true);
  };

  const confirmReject = (): void => {
    if (!motivo.trim() || !selectedEvento) return;

    setEventos(
      eventos.map((e) =>
        e.id === selectedEvento.id
          ? ({
              ...e,
              estado: ESTADOS_EVENTO.RECHAZADO,
              motivoRechazo: motivo,
            } as EventoExtended)
          : e
      )
    );
    setOpenRejectDialog(false);
    setSelectedEvento(null);
    setMotivo("");
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Validado":
        return { bg: "#10b98115", color: "#10b981" };
      case "Pendiente":
        return { bg: "#f59e0b15", color: "#f59e0b" };
      case "Rechazado":
        return { bg: "#ef444415", color: "#ef4444" };
      default:
        return { bg: "#99999915", color: "#999" };
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Validación de Eventos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Revisa evidencias y valida los eventos de combustible pendientes
        </Typography>
      </Box>

      {/* Alert Summary */}
      {eventosPendientes.length === 0 ? (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            borderRadius: 2,
            border: "1px solid #10b981",
            bgcolor: "#10b98110",
          }}
        >
          <Typography fontWeight={600}>
            ✅ No hay eventos pendientes de validación
          </Typography>
        </Alert>
      ) : (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 2,
            border: "1px solid #f59e0b",
            bgcolor: "#f59e0b10",
          }}
        >
          <Typography fontWeight={600}>
            <strong>{eventosPendientes.length}</strong>{" "}
            {eventosPendientes.length === 1
              ? "evento pendiente"
              : "eventos pendientes"}{" "}
            de validación
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Haz click en "Ver Evidencias" para revisar fotos, audio y GPS antes
            de validar
          </Typography>
        </Alert>
      )}

      {/* Grid de eventos pendientes */}
      <Grid container spacing={3}>
        {eventosPendientes.map((evento) => {
          const validationResult = validationResults.get(evento.id);
          const hasErrors = validationResult?.errores.length
            ? validationResult.errores.length > 0
            : false;
          const hasWarnings = validationResult?.advertencias.length
            ? validationResult.advertencias.length > 0
            : false;

          return (
            /* @ts-expect-error - MUI v7 Grid type incompatibility */
            <Grid xs={12} md={6} lg={4} key={evento.id}>
              <Card
                elevation={0}
                sx={{
                  border: "2px solid",
                  borderColor: hasErrors
                    ? "#ef4444"
                    : hasWarnings
                    ? "#f59e0b"
                    : "#e0e0e0",
                  borderRadius: 2,
                  transition: "all 0.3s",
                  bgcolor: hasErrors
                    ? "#ef444405"
                    : hasWarnings
                    ? "#f59e0b05"
                    : "white",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: getEstadoColor(evento.estado).bg,
                          color: getEstadoColor(evento.estado).color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LocalGasStationIcon />
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Evento #{evento.id}
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                          {evento.vehiculo || evento.vehiculoPatente}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Validation Status Chip */}
                    {validationResult && !validationResult.valido ? (
                      <Tooltip title={getResumenValidacion(validationResult)}>
                        <Chip
                          icon={<ErrorIcon />}
                          label={`${validationResult.errores.length} Errores`}
                          size="small"
                          color="error"
                          sx={{ fontWeight: 700 }}
                        />
                      </Tooltip>
                    ) : hasWarnings ? (
                      <Tooltip title={getResumenValidacion(validationResult!)}>
                        <Chip
                          icon={<WarningIcon />}
                          label="Advertencias"
                          size="small"
                          color="warning"
                          sx={{ fontWeight: 700 }}
                        />
                      </Tooltip>
                    ) : (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Cumple Políticas"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                  </Box>

                  {/* Empresa (SuperAdmin only) */}
                  {user?.rol === "SuperAdmin" && (
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight={600}
                      sx={{ mb: 1.5 }}
                    >
                      {evento.empresaNombre}
                    </Typography>
                  )}

                  {/* Info básica */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>Chofer:</strong>{" "}
                      {evento.chofer || evento.choferNombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fecha:</strong>{" "}
                      {format(new Date(evento.fecha), "dd/MM/yyyy HH:mm")}
                    </Typography>
                  </Box>

                  {/* Métricas */}
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "white",
                      borderRadius: 1.5,
                      mb: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Grid container spacing={2}>
                      {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Litros
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="#1E2C56"
                        >
                          {evento.litros} L
                        </Typography>
                      </Grid>
                      {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
                      <Grid xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Costo
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="#10b981"
                        >
                          $
                          {(evento.costo || evento.total || 0).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Evidencias indicator */}
                  {getEvidenciasByEvento(evento.id).length > 0 && (
                    <Box
                      sx={{
                        mb: 2,
                        p: 1.5,
                        bgcolor: "#3b82f615",
                        borderRadius: 1,
                        border: "1px solid #3b82f630",
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        color="#3b82f6"
                      >
                        📎 {getEvidenciasByEvento(evento.id).length} evidencias
                        disponibles
                      </Typography>
                    </Box>
                  )}

                  {/* Acciones */}
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetalle(evento)}
                    sx={{
                      bgcolor: "#1E2C56",
                      fontWeight: 700,
                      mb: 1.5,
                      "&:hover": { bgcolor: "#16213E" },
                    }}
                  >
                    Ver Evidencias y Validar
                  </Button>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleValidate(evento)}
                      sx={{ fontWeight: 600 }}
                      disabled={hasErrors} // Disable quick validate if errors
                    >
                      Validar Rápido
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => handleRejectClick(evento)}
                      sx={{ fontWeight: 600 }}
                    >
                      Rechazar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* EventoDetalle Dialog con evidencias */}
      {selectedEvento && (
        <EventoDetalle
          open={openDetalleDialog}
          onClose={() => setOpenDetalleDialog(false)}
          evento={selectedEvento}
          evidencias={getEvidenciasByEvento(selectedEvento.id)}
          onValidate={handleValidate}
          onReject={handleRejectClick}
        />
      )}

      {/* Dialog Rechazar */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "#ef444415",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CancelIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Rechazar Evento
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Evento #{selectedEvento?.id}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }} color="text.secondary">
            Ingresa el motivo del rechazo. Este comentario será visible para el
            chofer y supervisores.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Motivo del Rechazo *"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ej: Los kilómetros no coinciden con el odómetro, falta evidencia fotográfica del surtidor, etc."
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#fff",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setOpenRejectDialog(false);
              setMotivo("");
            }}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmReject}
            disabled={!motivo.trim()}
            startIcon={<CancelIcon />}
            sx={{ fontWeight: 700 }}
          >
            Confirmar Rechazo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
