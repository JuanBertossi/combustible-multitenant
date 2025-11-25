import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {
  ImageGallery,
  AudioPlayer,
  LocationMap,
} from "../../components/common/Evidence";
import type { Evento } from "../../types";
import type { Evidencia } from "../../types/reports";
import { format } from "date-fns";
import format from "date-fns/format";
import { Map } from "@google-maps/map";

interface EventoDetalleProps {
  open: boolean;
  onClose: () => void;
  evento: Evento | null;
  evidencias?: Evidencia[];
  onValidate?: (evento: Evento) => void;
  onReject?: (evento: Evento) => void;
}

export default function EventoDetalle({
  open,
  onClose,
  evento,
  evidencias = [],
  onValidate,
  onReject,
}: EventoDetalleProps) {
  if (!evento) return null;

  const fotos = evidencias.filter((e) => e.tipo.startsWith("foto"));
  const audio = evidencias.find((e) => e.tipo === "audio");
  const ubicacion = evidencias.find((e) => e.tipo === "ubicacion");

  const handleDownload = (evidencia: Evidencia) => {
    console.log("Descargando evidencia:", evidencia);
    // Implementar descarga
    window.open(evidencia.url, "_blank");
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: "#1E2C56",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <LocalGasStationIcon />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Evento de Carga #{evento.id}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(evento.fecha), "dd/MM/yyyy HH:mm")}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={evento.estado}
              sx={{
                bgcolor: getEstadoColor(evento.estado).bg,
                color: getEstadoColor(evento.estado).color,
                fontWeight: 700,
              }}
            />
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Información del Evento */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Información de la Carga
          </Typography>
          <Grid container spacing={2}>
            {/* Vehículo */}
            {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ bgcolor: "#f8f9fa" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <DirectionsCarIcon
                      sx={{ fontSize: 20, color: "#1E2C56" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Vehículo
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    {evento.vehiculoPatente}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Chofer */}
            {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ bgcolor: "#f8f9fa" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 20, color: "#1E2C56" }} />
                    <Typography variant="caption" color="text.secondary">
                      Operador
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    {evento.choferNombre}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Litros */}
            {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ bgcolor: "#f8f9fa" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <LocalGasStationIcon
                      sx={{ fontSize: 20, color: "#1E2C56" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Litros
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={700} color="#1E2C56">
                    {evento.litros} L
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Costo */}
            {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={{ bgcolor: "#f8f9fa" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <AttachMoneyIcon sx={{ fontSize: 20, color: "#10b981" }} />
                    <Typography variant="caption" color="text.secondary">
                      Costo Total
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={700} color="#10b981">
                    ${evento.total?.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Surtidor */}
            {evento.surtidorNombre && (
              // @ts-expect-error - MUI v7 Grid type incompatibility
              <Grid item xs={12} sm={6}>
                <Card elevation={0} sx={{ bgcolor: "#f8f9fa" }}>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Punto de Carga
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {evento.surtidorNombre}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Fecha */}
            {/* @ts-expect-error - MUI v7 Grid type incompatibility */}
            <Grid item xs={12} sm={6}>
              <Card elevation={0} sx={{ bgcolor: "#f8f9fa" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <CalendarTodayIcon
                      sx={{ fontSize: 18, color: "#1E2C56" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Fecha y Hora
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    {format(new Date(evento.fecha), "dd/MM/yyyy HH:mm")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Observaciones */}
          {evento.observaciones && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Observaciones
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {evento.observaciones}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Evidencias */}
        <Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Evidencias ({evidencias.length})
          </Typography>

          {evidencias.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                bgcolor: "#f8f9fa",
                borderRadius: 2,
              }}
            >
              <LocalGasStationIcon
                sx={{ fontSize: 64, color: "#ddd", mb: 2 }}
              />
              <Typography color="text.secondary">
                No hay evidencias cargadas para este evento
              </Typography>
            </Box>
          ) : (
            <>
              {/* Evidencias Fotográficas */}
              {fotos.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Evidencias Fotográficas ({fotos.length})
                  </Typography>
                  <ImageGallery images={fotos} onDownload={handleDownload} />
                </Box>
              )}

              {/* Nota de Voz */}
              {audio && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Nota de Voz
                  </Typography>
                  <AudioPlayer audio={audio} onDownload={handleDownload} />
                </Box>
              )}

              {/* Ubicación */}
              {/* {ubicacion && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    Ubicación de Carga
                  </Typography>
                  <LocationMap location={ubicacion} height={400} />
                </Box>
              )} */}

              <Map />
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cerrar
        </Button>
        {evento.estado === "Pendiente" && (
          <>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                if (onReject && evento) {
                  onReject(evento);
                }
              }}
            >
              Rechazar
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (onValidate && evento) {
                  onValidate(evento);
                }
              }}
              sx={{
                bgcolor: "#10b981",
                "&:hover": { bgcolor: "#059669" },
              }}
            >
              Validar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
